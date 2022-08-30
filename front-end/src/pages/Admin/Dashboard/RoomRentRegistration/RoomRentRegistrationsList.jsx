import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

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

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1 },
      { field: "sender_name", title: "Sender's name" },
      { field: "sender_email", title: "Sender's email" },
      { field: "sender_phone_number", title: "Sender's phone number" },
      {
        field: "registered_room_id",
        title: "Registered room",
        render: (rowData) => (
            roomInfos["" + rowData.registered_room_id]
          ),
      },
    ];

    return (
      <Fragment>
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
            editable={{
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
}
