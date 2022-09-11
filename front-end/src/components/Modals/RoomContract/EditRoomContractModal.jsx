import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AppUrl from "../../../RestAPI/AppUrl";

export default function EditRoomContractModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    deposit_amount: "",
  });
  const [effectiveUntilDate, setEffectiveUntilDate] = useState(moment());

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("editRoomContractModal")
      );
      model.show();
      axios.get(AppUrl.GetRoomContractDetails + props.roomContractId).then((response) => {
        if (response.data.status === 200) {
          setInput(response.data.roomContractDetails);
          setEffectiveUntilDate(response.data.roomContractDetails.effective_until);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.roomContractId]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("editRoomContractModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setEditModalStatus(false);
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const updateRoomContract = (e) => {
    e.preventDefault();
    const roomContract = {
      deposit_amount: input.deposit_amount,
      effective_until: moment(effectiveUntilDate).utc().format("YYYY-MM-DD"),
    };
    axios
      .put(AppUrl.UpdateRoomContract + props.roomContractId, roomContract)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          swal("Success", response.data.message, "success");
          props.updateModalStatus(true);
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
        id="editRoomContractModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Edit room contract</h5>
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
              <form>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <small className="text-danger customSmallError">
                  {errors.deposit_amount}
                </small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={updateRoomContract}
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
