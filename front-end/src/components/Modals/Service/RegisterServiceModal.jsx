import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import SearchRenter from "../../Search/SearchRenter";
import SearchService from "../../Search/SearchService";

export default function RegisterServiceModal(props) {
  const [errors, setErrors] = useState([]);
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("registerServiceModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("registerServiceModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setCreateModalStatus(false);
  };

  const getSelectedRenter = (renter) => {
    setSelectedRenter(renter);
  };

  const getSelectedService = (service) => {
    setSelectedService(service);
  };

  const register = (e) => {
    e.preventDefault();
    if(selectedRenter === null) {
      setErrors({ user_id: "The user field is required." });
          setTimeout(() => {
            displayModal();
          }, 1000);
    }
    if(selectedService === null) {
      setErrors({ service_id: "The service field is required." });
          setTimeout(() => {
            displayModal();
          }, 1000);
    }
    const registration = {
      user_id: selectedRenter.id,
      service_id: selectedService.id,
    };
    axios
      .post(AppUrl.RegisterService, registration)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          swal("Success", response.data.message, "success");
          props.updateCreateModalStatus(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            displayModal();
          }, 1000);
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
        id="registerServiceModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle" id="exampleModalLabel">
                Register for using optional service
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
                  <label className="customModalLabel">User:</label>
                  <SearchRenter getSelectedRenter={getSelectedRenter} />
                </div>
                <small className="text-danger customSmallError">{errors.user_id}</small>
                <div>
                  <label className="customModalLabel">Service:</label>
                  <SearchService getSelectedService={getSelectedService} />
                </div>
                <small className="text-danger customSmallError">{errors.service_id}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={register}
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
