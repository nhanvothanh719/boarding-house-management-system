import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../../components/Loading";
import AppUrl from "../../../RestAPI/AppUrl";
import MaterialTable from "material-table";
import axios from "axios";
import swal from "sweetalert";


export default function RoomsList() {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [roomsList, setRoomsList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowRooms).then((response) => {
      if (response.status === 200) {
        setRoomsList(response.data.allRooms);
      }
      setLoading(false);
    });
  }, []);

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "number", title: "Number", align: "center" },
      { field: "category_id", title: "Category ID" },
      { field: "status", title: "Status", lookup: {0:"Empty", 1:"Occupied", 2:"Full"} },
      {
        field: "description",
        title: "Description",
        emptyValue: () => <em>No description</em>,
      },
      { field: "area", title: "Area" },
      { field: "has_conditioner", title: "Conditioner", lookup: {0:"No", 1:"Yes"} },
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
            }}
            actions={[
              {
                icon: () => <button className="btn btn-warning">Edit</button>,
                onClick: (event, room) =>
                  history.push(`/admin/edit-room/${room.id}`),
              },
              {
                icon: () => <button className="btn btn-danger">Delete</button>,
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

