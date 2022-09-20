import React, { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";
import MaterialTable from "material-table";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import AddRoomRentModal from "../../../../components/Modals/Room/AddRoomRentModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";
import DefaultAvatar from "../../../../assets/images/default_avatar.png";

export default function RentRoom() {
  const [loading, setLoading] = useState(true);
  const [rentsList, setRentsLists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomRentsChange, setRoomRentsChange] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.GetAllRoomRents).then((response) => {
      if (response.data.status === 200) {
        setRentsLists(response.data.allRoomRents);
      }
    });
    if (roomRentsChange) {
      setRoomRentsChange(false);
    }
    setLoading(false);
  }, [roomRentsChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateCreateModalStatus = (status) => {
    setRoomRentsChange(status);
  };

  let columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      {
        title: "#",
        render: (rowData) => rowData.tableData.id + 1,
        width: "10%",
        align: "center",
      },
      {
        field: "room_id",
        title: "Room number",
        render: (rowData) => 
        <Link className="customDashboardLink" to={`/admin/edit-room/${rowData.room_id}`}>
          {rowData.room.number}
          </Link>,
      },
      {
        field: "renter_id",
        title: "Renter",
        align: "left",
        render: (rowData) => {
          return (
            <span>
              <img
                src={
                  rowData.renter.profile_picture !== null
                    ? `http://127.0.0.1:8000/${rowData.renter.profile_picture}`
                    : DefaultAvatar
                }
                alt="avatar"
                className="topAvatar"
              />
              <Link className="customDashboardLink" to={`/admin/edit-user/${rowData.renter_id}`}>{rowData.renter.name}</Link>
            </span>
          );
        },
      },
    ];
  }

  const cancelRent = (e, id) => {
    axios.delete(AppUrl.CancelRentRoom + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        setRoomRentsChange(true);
      } else if (response.data.status === 404) {
        swal("Fail", response.data.message, "error");
      }
    });
  };

  return (
    <Fragment>
      <WebPageTitle pageTitle="Room rents" />
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={(e) => setShowCreateModal(true)}
          >
            Create new room rent
          </Button>
          <AddRoomRentModal
            isShown={showCreateModal}
            setCreateModalStatus={setCreateModalStatus}
            updateCreateModalStatus={updateCreateModalStatus}
          />
        </div>
        <MaterialTable
          columns={columns}
          data={rentsList}
          title={
            <span className="customDatatableTitle">All room registrations</span>
          }
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
              icon: CancelPresentationIcon,
              tooltip: "Cancel",
              onClick: (event, registration) =>
                cancelRent(event, registration.id),
            },
          ]}
        />
      </div>
    </Fragment>
  );
}
