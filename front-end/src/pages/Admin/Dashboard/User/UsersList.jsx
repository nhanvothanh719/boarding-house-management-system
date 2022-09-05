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
import AppUrl from "../../../../RestAPI/AppUrl";
import DefaultAvatar from "../../../../assets/images/avatar.jpeg";
import "../../../../assets/css/Dashboard/datatable.css";
import CreateRenterModal from "../../../../components/Modals/Renter/CreateRenterModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function UsersList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentersList, setRentersList] = useState([]);
  const [rentersListChange, setRentersListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);

  useEffect(() => {
    axios.get(AppUrl.GetAllUsers).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allUsers);
      }
    });
    axios.get(AppUrl.GetUserProfile).then((response) => {
      if (response.data.status === 200) {
        setCurrentUserId(response.data.currentUser.id);
      }
    });
    setLoading(false);
    if (rentersListChange) {
      setRentersListChange(false);
    }
  }, [rentersListChange]);

  const lockRenterAccount = (id) => {
    axios.put(AppUrl.LockRenterAccount + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        setRentersListChange(true);
      }
    });
  };

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateModalStatus = (status) => {
    setRentersListChange(status);
  };

  var columns = [];
  columns = [
    { title: "#", render: (rowData) => rowData.tableData.id + 1 },
    {
      field: "profile_picture",
      title: "Avatar",
      export: false,
      width: "10%",
      render: (rowData) => (
        <img
          src={DefaultAvatar}
          alt="avatar"
          style={{ width: 40, borderRadius: "50%" }}
        />
      ),
    },
    // { field: "profile_picture", title: "Avatar", export: false, width: "10%", render: rowData => <img src={rowData.profile_picture} alt="avatar" style={{width: 40, borderRadius: '50%'}}/> },
    { field: "name", title: "Name", width: "20%" },
    { field: "email", title: "Email", width: "20%" },
    {
      field: "role_id",
      title: "Role",
      lookup: { 0: "Admin", 1: "Renter" },
      width: "10%",
      render: (rowData) => (
        <div>
          <span
            className={`${
              rowData.role_id === 0 ? "statusPending" : "statusOnGoing"
            }`}
          >
            {rowData.role_id === 0 ? "Admin" : "Renter"}
          </span>
        </div>
      ),
    },
    { field: "phone_number", title: "Phone number" },
    {
      field: "is_locked",
      title: "Status",
      render: (rowData) => (
        <div>
          <span
            className={`${
              rowData.is_locked === 0 ? "statusActive" : "statusPassive"
            }`}
          >
            {rowData.is_locked === 0 ? "Active" : "Locked"}
          </span>
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
          data={rentersList}
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
              icon: user.is_locked ? LockOpenIcon : LockOutlinedIcon,
              tooltip: user.is_locked ? "Unlock account" : "Lock account",
              onClick: (event, user) => lockRenterAccount(user.id),
              disabled: user.role_id === 0,
            }),
            (renter) => ({
              icon: FolderSharedIcon,
              tooltip: "Renter details",
              onClick: (event, renter) =>
                history.push(`/admin/view-all-invoices-of-renter/${renter.id}`),
              disabled: renter.role_id === 0,
            }),
          ]}
          editable={{
            isDeletable: (rowData) => rowData.id !== currentUserId,
            onRowDelete: (thisRenter) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const selectedRenter = [...details];
                  const index = thisRenter.tableData.id;
                  selectedRenter.splice(index, 1); //1: only one record
                  axios
                    .delete(AppUrl.DeleteRenter + thisRenter.id)
                    .then((response) => {
                      if (response.data.status === 200) {
                        swal("Success", response.data.message, "success");
                        setRentersListChange(true);
                      } else if (response.data.status === 404) {
                        swal("Error", response.data.message, "error");
                      }
                    });
                  resolve();
                }, 1000);
              }),
          }}
        />
      </div>
      <CreateRenterModal
        isShown={showCreateModal}
        setCreateModalStatus={setCreateModalStatus}
        updateModalStatus={updateModalStatus}
      />
    </Fragment>
  );
}
