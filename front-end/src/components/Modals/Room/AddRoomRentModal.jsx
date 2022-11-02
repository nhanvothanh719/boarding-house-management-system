import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import SearchRenter from "../../Search/SearchRenter";
import SearchRoom from "../../Search/SearchRoom";

export default function AddRoomRentModal(props) {
  const [errors, setErrors] = useState([]);
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("addRoomRentModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addRoomRentModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setCreateModalStatus(false);
  };

  const getSelectedRenter = (renter) => {
    setSelectedRenter(renter);
  };

  const getSelectedRoom = (room) => {
    setSelectedRoom(room);
  };

  const makeNewRent = (e) => {
    e.preventDefault();
    if(selectedRenter === null) {
      setErrors({ renter_id: "The renter field is required." });
          setTimeout(() => {
            displayModal();
          }, 1000);
    }
    if(selectedRoom === null) {
      setErrors({ room_id: "The room field is required." });
          setTimeout(() => {
            displayModal();
          }, 1000);
    }
    const rent = {
      renter_id: selectedRenter.id,
      room_id: selectedRoom.id,
    };
    axios
      .post(AppUrl.RentRoom, rent)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          setSelectedRenter(null);
          setSelectedRoom(null);
          swal("Success", response.data.message, "success");
          props.updateCreateModalStatus(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            displayModal();
          }, 1000);
        } else if (response.data.status === 400) {
          setSelectedRenter(null);
          setSelectedRoom(null);
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <div
        class="modal fade"
        id="addRoomRentModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle" id="exampleModalLabel">
                Add new room rent
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={closeModal}>
                  &times;
                </span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form className="">
                <div>
                  <label className="customModalLabel">Renter:</label>
                  <SearchRenter getSelectedRenter={getSelectedRenter} />
                </div>
                <small className="text-danger customSmallError">{errors.renter_id}</small>
                <div>
                  <label className="customModalLabel">Room number:</label>
                  <SearchRoom getSelectedRoom={getSelectedRoom} />
                </div>
                <small className="text-danger customSmallError">{errors.room_id}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={makeNewRent}
              >
                Create
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
