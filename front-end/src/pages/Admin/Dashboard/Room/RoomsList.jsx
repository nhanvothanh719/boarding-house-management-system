import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import axios from "axios";
import swal from "sweetalert";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function RoomsList() {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [roomsList, setRoomsList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowRooms).then((response) => {
      if (response.status === 200) {
        setRoomsList(response.data.allRooms);
      }
    });
    setLoading(false);
  }, []);


  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      { field: "number", title: "Number", align: "center" },
      { field: "category_id", title: "Category", render: rowData => <p> {rowData.category.name} </p> },
      { field: "status", title: "Status", render: rowData => <p> {rowData.status.name} </p>},
      {
        field: "description",
        title: "Description",
        emptyValue: () => <em>No description</em>,
      },
      { field: "area", title: "Area" },
      { field: "has_conditioner", title: "Conditioner", lookup: {0:"No", 1:"Yes"}},
      { field: "has_fridge", title: "Fridge", lookup: {0:"No", 1:"Yes"} },
      { field: "has_wardrobe", title: "Wardrobe", lookup: {0:"No", 1:"Yes"} },
    ];

    const deleteRoom = (e, id) => {
      e.preventDefault();
      const selectedRoom = e.currentTarget;
      selectedRoom.innerText = "Deleting";
      axios.delete(AppUrl.DeleteRoom + id).then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          //Delete table row
          selectedRoom.closest("tr").remove();
          history.push('/admin/view-all-rooms');
        } else if (response.data.status === 404) {
          swal("Fail", response.data.message, "error");
          selectedRoom.innerText = "Delete";
        }
      });
    };

    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
            <Link to="/admin/create-room" className="createBtn">
              Add new room
            </Link>
            <Link to="/admin/rent-room" className="createBtn">
              Assign renter to room
            </Link>
          </div>
          <MaterialTable
            columns={columns}
            data={roomsList}
            title="All rooms"
            options={{
              searchAutoFocus: false,
              searchFieldVariant: "outlined",
              filtering: false,
              pageSizeOptions: [5, 10],
              paginationType: "stepped",
              exportButton: true,
              exportAllData: true,
              actionsColumnIndex: -1,
              grouping: true,
            }}
            actions={[
              {
                icon: 'visibility',
                tooltip: 'Details',
                onClick: (event, room) =>
                  history.push(`/admin/room/${room.id}`),
              },
              {
                icon: 'edit',
                tooltip: 'Edit',
                onClick: (event, room) =>
                  history.push(`/admin/edit-room/${room.id}`),
              },
              {
                icon: 'delete',
                tooltip: 'Delete',
                onClick: (event, room) => 
                deleteRoom(event, room.id),
              },
            ]}
          />
        </div>
      </Fragment>
    );
  }
}

