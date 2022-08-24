import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

export default function EditSignatures(props) {
  const [errors, setErrors] = useState([]);
  const [previousSignatures, setPreviousSignatures] = useState({
    owner_signature: [],
    renter_signature: [],
  });
  const [ownerSignature, setOwnerSignature] = useState([]);
  const [renterSignature, setRenterSignature] = useState([]);

  useEffect(() => {
    if (props.isShown === true) {
      axios
        .get(AppUrl.GetRoomContractDetails + props.roomContractId)
        .then((response) => {
          if (response.data.status === 200) {
            //Avoid infinity loop when using setState in useEffect
            //useEffect(() => { setState(state => ({ ...state, a: props.a })); }, [props.a]);
            setPreviousSignatures(
              (previousSignatures) => ({
                ...previousSignatures,
                owner_signature:
                  response.data.roomContractDetails.owner_signature,
              }),
              [response.data.roomContractDetails.owner_signature]
            );
            setPreviousSignatures(
              (previousSignatures) => ({
                ...previousSignatures,
                renter_signature:
                  response.data.roomContractDetails.renter_signature,
              }),
              [response.data.roomContractDetails.renter_signature]
            );
          }
        });
      var modal = new window.bootstrap.Modal(
        document.getElementById("updateSignaturesModal")
      );
      modal.show();
    }
  }, [props.isShown, props.roomContractId]);

  const closeModal = (e, value) => {
    props.setEditModalStatus(false);
  };

  const displayModal = () => {
    var modal = new window.bootstrap.Modal(
      document.getElementById("updateSignaturesModal")
    );
    modal.show();
  };

  const handleOwnerSignature = (e) => {
    setOwnerSignature({ image: e.target.files[0] });
  };

  const handleRenterSignature = (e) => {
    setRenterSignature({ image: e.target.files[0] });
  };

  const updateSignatures = (e) => {
    e.preventDefault();
    const roomContract = new FormData();
    if (ownerSignature.image) {
      roomContract.append("owner_signature", ownerSignature.image);
    }
    if (renterSignature.image) {
      roomContract.append("renter_signature", renterSignature.image);
    }
    axios
      .post(AppUrl.UpdateSignatures + props.roomContractId, roomContract)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          swal("Success", response.data.message, "success");
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
        id="updateSignaturesModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Edit signatures</h5>
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
              <form className="flexForm" enctype="multipart/form-data">
                <div className="form-group">
                  <label className="customModalLabel">Owner signature:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="owner_signature"
                    onChange={handleOwnerSignature}
                    id="inputOwnerSignature"
                  />
                </div>
                <small className="text-danger">{errors.owner_signature}</small>
                <img
                  src={`http://127.0.0.1:8000/${previousSignatures.owner_signature}`}
                  alt=""
                  style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                />
                <div className="form-group">
                  <label className="customModalLabel">Renter signature:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="renter_signature"
                    onChange={handleRenterSignature}
                    id="inputRenterSignature"
                  />
                </div>
                <small className="text-danger">{errors.renter_signature}</small>
                <img
                  src={`http://127.0.0.1:8000/${previousSignatures.renter_signature}`}
                  alt=""
                  style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                />
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={updateSignatures}
              >
                Update
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
