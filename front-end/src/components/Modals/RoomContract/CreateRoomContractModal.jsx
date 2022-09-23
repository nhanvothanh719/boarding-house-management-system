import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AppUrl from "../../../RestAPI/AppUrl";
import SearchRenter from "../../Search/SearchRenter";

export default function CreateRoomContractModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    deposit_amount: "",
  });
  const [images, setImages] = useState({
    owner_signature: [],
    renter_signature: [],
  });
  const [effectiveFromDate, setEffectiveFromDate] = useState(moment());
  const [effectiveUntilDate, setEffectiveUntilDate] = useState(moment());
  const [selectedRenter, setSelectedRenter] = useState(null);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("addRoomContractModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addRoomContractModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setCreateModalStatus(false);
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleImageInput = (e) => {
    e.persist();
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const getSelectedRenter = (renter) => {
    setSelectedRenter(renter);
  };

  const addRoomContract = (e) => {
    e.preventDefault();
    if(selectedRenter === null) {
      setErrors({ renter_id: "The renter field is required." });
          setTimeout(() => {
            displayModal();
          }, 1000);
    }
    const roomContract = new FormData();
    roomContract.append("renter_id", selectedRenter.id);
    roomContract.append("deposit_amount", input.deposit_amount);
    roomContract.append("owner_signature", images.owner_signature);
    roomContract.append("renter_signature", images.renter_signature);
    roomContract.append(
      "effective_from",
      moment(effectiveFromDate).utc().format("YYYY-MM-DD")
    );
    roomContract.append(
      "effective_until",
      moment(effectiveUntilDate).utc().format("YYYY-MM-DD")
    );
    axios
      .post(AppUrl.StoreRoomContract, roomContract)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          setInput({
            deposit_amount: "",
          });
          setImages({
            owner_signature: [],
            renter_signature: [],
          });
          setEffectiveFromDate(moment());
          setEffectiveUntilDate(moment());
          setSelectedRenter(null);
          swal("Success", response.data.message, "success");
          props.updateModalStatus(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            displayModal();
          }, 1000);
        } else if (response.data.status === 400) {
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
        id="addRoomContractModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Add new room contract</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form encType="multipart/form-data">
              <div>
                  <label className="customModalLabel">Renter:</label>
                  <SearchRenter getSelectedRenter={getSelectedRenter} />
                </div>
                <small className="text-danger customSmallError">{errors.renter_id}</small>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div>
                  <label className="customModalLabel">Effective from:</label>
                  <DatePicker
                    views={["day", "month", "year"]}
                    label="Effective from"
                    name="effective_from"
                    value={effectiveFromDate}
                    onChange={(selectedDate) => {
                      setEffectiveFromDate(selectedDate);
                    }}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} helperText={null} />
                    )}
                  />
                </div>
                  <small className="text-danger customSmallError">{errors.effective_from}</small>
                  <div>
                  <label className="customModalLabel">Effective until:</label>
                  <DatePicker
                    views={["day", "month", "year"]}
                    label="Effective until"
                    name="effective_until"
                    value={effectiveUntilDate}
                    onChange={(selectedDate) => {
                      setEffectiveUntilDate(selectedDate);
                    }}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} helperText={null} />
                    )}
                  />
                  </div>
                  <small className="text-danger customSmallError">
                    {errors.effective_until}
                  </small>
                </LocalizationProvider>
                <div>
                  <label className="customModalLabel">Deposit amount:</label>
                  <TextField
                    label="Deposit amount"
                    name="deposit_amount"
                    value={input.deposit_amount}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">{errors.deposit_amount}</small>
                <div>
                  <label className="customModalLabel">Owner signature:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="owner_signature"
                    onChange={handleImageInput}
                    id="inputOwnerSignature"
                    accept="image/*"
                  />
                </div>
                <small className="text-danger customSmallError">{errors.owner_signature}</small>
                <div>
                  <label className="customModalLabel">Renter signature:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="renter_signature"
                    onChange={handleImageInput}
                    id="inputRenterSignature"
                    accept="image/*"
                  />
                </div>
                <small className="text-danger customSmallError">{errors.renter_signature}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={addRoomContract}
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
