import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import MaterialTable from "material-table";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import SearchRenter from "../../../../components/Search/SearchRenter";
import SearchRoom from "../../../../components/Search/SearchRoom";

export default function RentRoom() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentsList, setRentsLists] = useState([]);
  const [columnNumberChange, setColumnNumberChange] = useState(false);
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.GetAllRoomRents).then((response) => {
      if (response.data.status === 200) {
        setRentsLists(response.data.allRoomRents);
      }
    });
    if (columnNumberChange) {
      setColumnNumberChange(false);
    }
    setLoading(false);
  }, [columnNumberChange]);

  const getSelectedRenter = (renter) => {
    setSelectedRenter(renter);
  }

  const getSelectedRoom = (room) => {
    setSelectedRoom(room);
  }

  const makeNewRent = (e) => {
    e.preventDefault();
    const rent = {
      renter_id: selectedRenter.id,
      room_id: selectedRoom.id,
    };
    axios
      .post(AppUrl.RentRoom, rent)
      .then((response) => { 
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          setColumnNumberChange(true);
        } else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "id", title: "ID", align: "center" },
      {
        field: "room_id",
        title: "Room number",
        render: (rowData) => <p> {rowData.room.number} </p>,
      },
      {
        field: "renter_id",
        title: "Renter",
        render: (rowData) => <p> {rowData.renter.name} </p>,
      },
    ];
  }

  const cancelRent = (e, id) => {
    e.preventDefault();
    const selectedRentSection = e.currentTarget;
    selectedRentSection.innerText = "Deleting";
    axios.delete(AppUrl.CancelRentRoom + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        //Delete table row
        selectedRentSection.closest("tr").remove();
      } else if (response.data.status === 404) {
        swal("Fail", response.data.message, "error");
        selectedRentSection.innerText = "Delete";
      }
    });
  };

  return (
    <Fragment>
      <div className="topContainer">
        <h1>Register to use service</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          <form className="flexForm" onSubmit={makeNewRent}>
            <div className="formInput">
              <label>Renter ID:</label>
              <SearchRenter getSelectedRenter={getSelectedRenter}/>
            </div>
            <small className="text-danger">{errors.renter_id}</small>
            <div className="formInput">
              <label>Room number:</label>
              <SearchRoom getSelectedRoom={getSelectedRoom}/>
            </div>
            <small className="text-danger">{errors.room_number}</small>
            <button type="submit" className="formButton">
              Register
            </button>
          </form>
          <div>
            <br /> <br /> <br />
            <MaterialTable
              columns={columns}
              data={rentsList}
              title="All registrations"
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
                  icon: "delete",
                  tooltip: "Cancel",
                  onClick: (event, registration) =>
                    cancelRent(event, registration.id),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
