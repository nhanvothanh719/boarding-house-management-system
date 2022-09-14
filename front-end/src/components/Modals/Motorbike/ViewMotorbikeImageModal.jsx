import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

import DefaultMotorbikeImg from "../../../assets/images/default_motorbike.jpeg";

export default function ViewMotorbikeImageModal(props) {
  const [motorbikeImage, setMotorbikeImage] = useState([]);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("viewMotorbikeImageModal")
      );
      model.show();
      axios.get(AppUrl.EditMotorbike + props.motorbikeId).then((response) => {
        if (response.data.status === 200) {
          setMotorbikeImage(response.data.motorbike.motorbike_image);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.motorbikeId]);

  const closeModal = (e, value) => {
    props.setViewImageModalStatus(false);
  };

  return (
    <Fragment>
      <div
        class="modal fade"
        id="viewMotorbikeImageModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">View motorbike</h5>
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
            <div class="modal-body text-center">
              <hr />
              <img
                src={
                  motorbikeImage !== null
                    ? `http://127.0.0.1:8000/${motorbikeImage}`
                    : DefaultMotorbikeImg
                }
                alt=""
                style={{ width: "370px", height: "250px", borderRadius: "10%" }}
              />
            </div>
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
    </Fragment>
  );
}
