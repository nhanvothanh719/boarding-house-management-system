import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import MaterialTable from "material-table";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function RentRoom() {
    const [loading, setLoading] = useState(true);
    const [rentsList, setRentsLists] = useState([]);
    const [rooms] = useState([]);
    const [errors, setErrors] = useState([]);
    const [input, setInput] = useState({
      room_number: "",
      renter_id: "",
    });
    const [columnNumberChange, setColumnNumberChange] = useState(false);
  
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
  
    const handleInput = (e) => {
      e.persist();
      setInput({ ...input, [e.target.name]: e.target.value });
    };
  
    const makeNewRent = (e) => {
      e.preventDefault();
      const rent = {
        renter_id: input.renter_id,
        room_number: input.room_number,
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
  
    const findUser = (e) => {
      e.preventDefault();
      if (input.renter_id) {
        axios
          .get(AppUrl.FindName + input.renter_id)
          .then((response) => {
            if (response.data.status === 200) {
              swal("User found", response.data.name, "success");
            } else if (response.data.status === 404) {
              swal("No user found", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
                <input
                  type="text"
                  className="inputItem"
                  name="renter_id"
                  onChange={handleInput}
                  value={input.renter_id}
                />
              </div>
              <small className="text-danger">{errors.renter_id}</small>
              <button onClick={findUser}>Find person</button>
              <div className="formInput">
              <label>Room number:</label>
                <select
                  className="form-control"
                  name="room_number"
                  onChange={handleInput}
                  value={input.room_number}
                >
                  <option selected>--- Select room ---</option>
                  {rooms.map((room) => {
                    return (
                      <option value={room.number} key={room.id}>
                        {" "}
                        {room.number}{" "}
                      </option>
                    );
                  })}
                </select>
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
                    icon: () => (
                      <button className="btn btn-danger">Cancel</button>
                    ),
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
