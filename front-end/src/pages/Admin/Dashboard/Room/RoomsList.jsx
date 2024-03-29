import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import axios from "axios";
import swal from "sweetalert";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import { Button } from "react-bootstrap";
import CreateRoomModal from "../../../../components/Modals/Room/CreateRoomModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function RoomsList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomsList, setRoomsList] = useState([]);
  const [roomsListChange, setRoomsListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const status = ["Empty", "Occupied", "Full"];
  const statusStyle = ["statusOnGoing", "statusActive", "statusPassive"];
  const doesHave = ["No", "Yes"];
  const doesHaveStyle = ["statusPassive", "statusActive"];

  useEffect(() => {
    axios.get(AppUrl.ShowRooms).then((response) => {
      if (response.status === 200) {
        console.log(response.data.allRooms);
        setRoomsList(response.data.allRooms);
      }
    });
    setLoading(false);
    if (roomsListChange) {
      setRoomsListChange(false);
    }
  }, [roomsListChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateModalStatus = (status) => {
    setRoomsListChange(status);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      { field: "number", title: "Number", align: "center" },
      { field: "category_id", title: "Category", render: rowData => <p> {rowData.category.name} </p> },
      { 
        field: "status", 
        title: "Status", 
        render: (rowData) => {
          return (
              <span className={`${statusStyle[rowData.status - 1]}`}>{status[rowData.status - 1]}</span>
          );
        }
      },
      { field: "area", title: "Area" },
      { 
        field: "has_conditioner", 
        title: "Conditioner", 
        lookup: {0:"No", 1:"Yes"},
        render: rowData => (
          <div>
              <span className={`${doesHaveStyle[rowData.has_conditioner]}`}>{doesHave[rowData.has_conditioner]}</span>
          </div>
        )
      },
      { field: "has_fridge", 
      title: "Fridge", 
      lookup: {0:"No", 1:"Yes"},
      render: rowData => (
        <div>
            <span className={`${doesHaveStyle[rowData.has_fridge]}`}>{doesHave[rowData.has_fridge]}</span>
        </div>
      ) 
    },
      { 
        field: "has_wardrobe", 
        title: "Wardrobe", 
        lookup: {0:"No", 1:"Yes"},
        render: rowData => (
          <div>
              <span className={`${doesHaveStyle[rowData.has_wardrobe]}`}>{doesHave[rowData.has_wardrobe]}</span>
          </div>
        )
       },
    ];

    if (loading) {
    return <Loading />;
  }
    return (
      <Fragment>
        <WebPageTitle pageTitle="Rooms" />
        <div className="customDatatable">
          <div className="customDatatableHeader">
            <Button
            className="createBtn" 
            style={{ backgroundColor: "white", color: "#1C4E80" }} 
            onClick={(e) => setShowCreateModal(true)}
            >
              Add new room
            </Button>
          </div>
          <MaterialTable
            columns={columns}
            data={roomsList}
            title={<span className="customDatatableTitle">All rooms</span>}
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
                fontFamily: 'Anek Telugu, sans-serif',
              }
            }}
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit',
                onClick: (event, room) =>
                  history.push(`/admin/edit-room/${room.id}`),
              },
            ]}
            editable={{
              onRowDelete: (thisRoom) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedRoom = [...details];
                    const index = thisRoom.tableData.id;
                    selectedRoom.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteRoom + thisRoom.id)
                      .then((response) => {
                        if (response.data.status === 200) {
                          swal("Success", response.data.message, "success");
                          setRoomsListChange(true);
                        } else if (response.data.status === 404) {
                          swal("Error", response.data.message, "error");
                        } else if (response.data.status === 400) {
                          swal("Warning", response.data.message, "warning");
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </div>
        <CreateRoomModal
        isShown={showCreateModal}
        setCreateModalStatus={setCreateModalStatus}
        updateModalStatus={updateModalStatus}
        />
      </Fragment>
    );
}

