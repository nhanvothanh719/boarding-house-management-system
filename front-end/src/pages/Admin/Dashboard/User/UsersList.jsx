import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import axios from "axios";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Loading from "../../../../components/Loading/Loading";
import ConfirmLoading from "../../../../components/Loading/ConfirmLoading";
import AppUrl from "../../../../RestAPI/AppUrl";
import DefaultAvatar from "../../../../assets/images/default_avatar.png";
import "../../../../assets/css/Dashboard/datatable.css";
import CreateUserModal from "../../../../components/Modals/User/CreateUserModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function UsersList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderClass, setLoaderClass] = useState("d-none");
  const [displayComponentsClass, setDisplayComponentsClass] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [usersListChange, setUsersListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);
  const isTrue = ["Active", "Locked"];
  const isTrueStyle = ["statusActive", "statusPassive"];
  const role = ["Admin", "Renter"];
  const roleStyle = ["statusPending", "statusOnGoing"];
  const isLocked = [LockOutlinedIcon, LockOpenIcon];

  useEffect(() => {
    axios.get(AppUrl.GetAllUsers).then((response) => {
      if (response.data.status == 200) {
        setUsersList(response.data.allUsers);
      }
    });
    axios.get(AppUrl.GetUserProfile).then((response) => {
      if (response.data.status == 200) {
        setCurrentUserId(response.data.currentUser.id);
      }
    });
    setLoading(false);
    if (usersListChange) {
      setUsersListChange(false);
    }
  }, [usersListChange]);

  const lockUserAccount = (id) => {
    axios.put(AppUrl.LockUserAccount + id).then((response) => {
      if (response.data.status == 200) {
        swal("Success", response.data.message, "success");
        setUsersListChange(true);
      } else if (response.data.status == 400) {
        swal("Warning", response.data.message, "warning");
      }
    });
  };

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateModalStatus = (status) => {
    setUsersListChange(status);
  };

  var columns = [];
  columns = [
    {
      title: "#",
      render: (rowData) => rowData.tableData.id + 1,
      width: "10%",
      align: "center",
    },
    {
      field: "profile_picture",
      title: "Avatar",
      export: false,
      width: "7%",
      render: (rowData) => (
        <img
          src={
            rowData.profile_picture !== null ? `https://bee-house-bucket.s3.amazonaws.com/${rowData.profile_picture}` : DefaultAvatar
          }
          alt="avatar"
          className="topAvatar"
        />
      ),
    },
    { field: "name", title: "Name", width: "20%" },
    { field: "email", title: "Email", width: "20%" },
    {
      field: "role",
      title: "Role",
      lookup: { 0: "Admin", 1: "Renter" },
      width: "10%",
      render: (rowData) => (
        <div>
          <span className={`${roleStyle[rowData.role]}`}>{role[rowData.role]}</span>
        </div>
      ),
    },
    {
      field: "is_locked",
      title: "Account status",
      render: (rowData) => (
        <div>
          <span className={`${isTrueStyle[rowData.is_locked]}`}>{isTrue[rowData.is_locked]}</span>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Users" />
      <div className={loaderClass}>
        <ConfirmLoading />
      </div>
      <div className={displayComponentsClass}>
        <div className="customDatatable">
          <div className="customDatatableHeader">
            <Button
              className="createBtn"
              style={{ backgroundColor: "white", color: "#1C4E80" }}
              onClick={(e) => setShowCreateModal(true)}
            >
              Add new user
            </Button>
          </div>
          <MaterialTable
            columns={columns}
            data={usersList}
            title={<span className="customDatatableTitle">All users</span>}
            options={{
              searchAutoFocus: false,
              searchFieldVariant: "outlined",
              filtering: false,
              pageSizeOptions: [5, 10],
              paginationType: "stepped",
              exportButton: true,
              exportAllData: true,
              actionsColumnIndex: -1,
              headerStyle: {
                fontFamily: "Anek Telugu, sans-serif",
              },
            }}
            actions={[
              {
                icon: AccountCircleIcon,
                tooltip: "View & Edit",
                onClick: (event, user) =>
                  history.push(`/admin/edit-user/${user.id}`),
              },
              (user) => ({
                icon: isLocked[user.is_locked],
                tooltip: user.is_locked == 1 ? "Unlock account" : "Lock account",
                onClick: (event, user) => lockUserAccount(user.id),
                disabled: user.role == 0,
              }),
              (user) => ({
                icon: FolderSharedIcon,
                tooltip: "User details",
                onClick: (event, user) =>
                  history.push(
                    `/admin/view-all-invoices-of-renter/${user.id}`
                  ),
                disabled: user.role == 0,
              }),
            ]}
            editable={{
              isDeletable: (rowData) => rowData.id !== currentUserId,
              onRowDelete: (thisUser) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedUser = [...details];
                    const index = thisUser.tableData.id;
                    selectedUser.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteUser + thisUser.id)
                      .then((response) => {
                        if (response.data.status == 200) {
                          swal("Success", response.data.message, "success");
                          setUsersListChange(true);
                        } else if (response.data.status == 404) {
                          swal("Error", response.data.message, "error");
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </div>
        <CreateUserModal
          isShown={showCreateModal}
          setLoaderClass={setLoaderClass}
          setDisplayComponentsClass={setDisplayComponentsClass}
          setCreateModalStatus={setCreateModalStatus}
          updateModalStatus={updateModalStatus}
        />
      </div>
    </Fragment>
  );
}
