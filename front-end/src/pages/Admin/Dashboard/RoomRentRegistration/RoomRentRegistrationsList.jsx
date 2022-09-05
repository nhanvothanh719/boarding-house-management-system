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
  const [roomInfos, setRoomInfos] = useState([]);
  const [roomRentRegistrationsListChange, setRoomRentRegistrationsListChange] =
    useState(false);

  useEffect(() => {
    axios.get(AppUrl.ShowRoomRentRegistrations).then((response) => {
      if (response.status === 200) {
        setRoomRentRegistrationsList(response.data.allRoomRentRegistrations);
        setRoomInfos(response.data.allRoomInfos);
        console.log(response.data.allRoomInfos);
      }
    });
    setLoading(false);
    if (roomRentRegistrationsListChange) {
      setRoomRentRegistrationsListChange(false);
    }
  }, [roomRentRegistrationsListChange]);

  const acceptRegistrationRequest = (id) => {
    axios.put(AppUrl.AcceptRegistrationRequest + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        setRoomRentRegistrationsListChange(true);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
      }
    })
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1 },
      { field: "sender_name", title: "Sender's name" },
      {
        field: "sender_gender",
        title: "Gender",
        lookup: {0:"Female", 1:"Male"},
        render: rowData => (
          <div>
              <span className={`${rowData.sender_gender === 1 ? "statusPending" : "statusOnGoing"}` }>{rowData.sender_gender === 1 ? "Male" : "Female" }</span>
          </div>
        )
      },
      { field: "sender_email", title: "Sender's email" },
      { field: "sender_phone_number", title: "Sender's phone number" },
      {
        field: "registered_room_id",
        title: "Registered room",
        render: (rowData) => (
            roomInfos["" + rowData.registered_room_id]
          ),
      },
      {
        field: "is_accepted",
        title: "Accepted",
        lookup: {0:"No", 1:"Yes"},
        render: rowData => (
          <div>
              <span className={`${rowData.is_accepted === 1 ? "statusActive" : "statusPassive"}` }>{rowData.is_accepted === 1 ? "Yes" : "No" }</span>
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
                icon: request.is_accepted ? GroupRemoveIcon : GroupAddIcon,
                tooltip: request.is_accepted ? 'Cancel acceptance' : 'Accept',
                onClick: (event, request) => acceptRegistrationRequest(request.id),
              }),
              ]}
            editable={{
              isDeletable: rowData => !rowData.is_accepted,
              onRowDelete: (thisRequest) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedRequest = [...details];
                    const index = thisRequest.tableData.id;
                    selectedRequest.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteRoomRentRegistration + thisRequest.id)
                      .then((response) => {
                        if (response.data.status === 200) {
                          swal("Success", response.data.message, "success");
                          setRoomRentRegistrationsListChange(true);
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
      </Fragment>
    );
  }
