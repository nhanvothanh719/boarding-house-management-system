import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function RoomRentRegistrationsList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomRentRegistrationsList, setRoomRentRegistrationsList] = useState([]);
  const [roomRentRegistrationsListChange, setRoomRentRegistrationsListChange] = useState(false);
  const gender = ["Female", "Male"];
  const genderStyle = ["statusOnGoing", "statusPending"];
  const isAccepted = ["No", "Yes"];
  const isAcceptedStyle = ["statusPassive", "statusActive"];
  const isAcceptedIcone = [GroupAddIcon, GroupRemoveIcon];

  useEffect(() => {
    axios.get(AppUrl.ShowRoomRentRegistrations).then((response) => {
      if (response.status == 200) {
        setRoomRentRegistrationsList(response.data.allRoomRentRegistrations);
      }
    });
    setLoading(false);
    if (roomRentRegistrationsListChange) {
      setRoomRentRegistrationsListChange(false);
    }
  }, [roomRentRegistrationsListChange]);

  const acceptRegistrationRequest = (id) => {
    axios.put(AppUrl.AcceptRegistrationRequest + id).then((response) => {
      if (response.data.status == 200) {
        swal("Success", response.data.message, "success");
        setRoomRentRegistrationsListChange(true);
      } else if (response.data.status == 404) {
        swal("Error", response.data.message, "error");
      } else if (response.data.status == 400) {
        swal("Warning", response.data.message, "warning");
      }
    })
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      { field: "sender_name", title: "Name", width: "20%", },
      {
        field: "sender_gender",
        title: "Gender",
        lookup: {0:"Female", 1:"Male"},
        render: rowData => (
          <div>
              <span className={`${genderStyle[rowData.sender_gender]}` }>{gender[rowData.sender_gender]}</span>
          </div>
        )
      },
      { field: "sender_email", title: "Email" },
      { field: "sender_phone_number", title: "Phone number" },
      {
        field: "registered_room_id",
        title: "Registered room",
        width: "10%",
        render: rowData => (
          <div>
              <span className="statusOnGoing">{rowData.room.number}</span>
          </div>
        )
      },
      {
        field: "is_accepted",
        title: "Accepted",
        width: "10%",
        lookup: {0:"No", 1:"Yes"},
        render: rowData => (
          <div>
              <span className={`${isAcceptedStyle[rowData.is_accepted]}` }>{isAccepted[rowData.is_accepted]}</span>
          </div>
        )
      },
    ];

    if (loading) {
      return <Loading />;
    }
    return (
      <Fragment>
        <WebPageTitle pageTitle="Room registrations" />
        <div className="customDatatable">
          <div className="customDatatableHeader"></div>
          <MaterialTable
            columns={columns}
            data={roomRentRegistrationsList}
            title={
              <span className="customDatatableTitle">
                All room rent registration requests
              </span>
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
              (request) => ({
                icon: isAcceptedIcone[request.is_accepted],
                tooltip: request.is_accepted ? 'Cancel acceptance' : 'Accept',
                onClick: (event, request) => acceptRegistrationRequest(request.id),
              }),
              ]}
            editable={{
              isDeletable: rowData => rowData.is_accepted == false,
              onRowDelete: (thisRequest) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedRequest = [...details];
                    const index = thisRequest.tableData.id;
                    selectedRequest.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteRoomRentRegistration + thisRequest.id)
                      .then((response) => {
                        if (response.data.status == 200) {
                          swal("Success", response.data.message, "success");
                          setRoomRentRegistrationsListChange(true);
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
      </Fragment>
    );
  }
