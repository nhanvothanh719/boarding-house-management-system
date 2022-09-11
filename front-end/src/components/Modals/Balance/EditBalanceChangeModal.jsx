import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AppUrl from "../../../RestAPI/AppUrl";

export default function EditBalanceChangeModal(props) {
  const [input, setInput] = useState({
    description: "",
    amount: "",
  });
  const [errors, setErrors] = useState([]);
  const [occurredDate, setOccurredDate] = useState(moment());

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("editBalanceChangeModal")
      );
      model.show();
      axios.get(AppUrl.EditBalanceChange + props.balanceChangeId).then((response) => {
        if (response.data.status === 200) {
          setInput(response.data.balanceChange);
          setOccurredDate(response.data.balanceChange.occurred_on);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.balanceChangeId]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("editBalanceChangeModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setEditModalStatus(false);
  };

  const editBalanceChange = (e) => {
    e.preventDefault();
    const data = {
      amount: input.amount,
      description: input.description,
      occurred_on: moment(occurredDate).utc().format("YYYY-MM-DD hh:mm:ss"),
    };
    axios
      .put(AppUrl.UpdateBalanceChange + props.balanceChangeId, data)
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
        id="editBalanceChangeModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle" id="exampleModalLabel">
                Edit balance change
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
              <form id="createCategoryForm">
                <div>
                  <label className="customModalLabel">
                    Description (Source):
                  </label>
                  <TextField
                    label="Description"
                    name="description"
                    value={input.description}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">
                  {errors.description}
                </small>
                <div className="">
                  <label className="customModalLabel">Amount:</label>
                  <TextField
                    label="Amount"
                    name="amount"
                    value={input.amount}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">
                  {errors.amount}
                </small>
                <div className="">
                  <label className="customModalLabel">Occurred on:</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={["day", "month", "year"]}
                      label="Occurred on"
                      name="occurred_on"
                      value={occurredDate}
                      onChange={(selectedDate) => {
                        setOccurredDate(selectedDate);
                      }}
                      renderInput={(params) => (
                        <TextField fullWidth {...params} helperText={null} />
                      )}
                    />
                  </LocalizationProvider>
                </div>
                <small className="text-danger customSmallError">
                  {errors.occurred_on}
                </small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={editBalanceChange}
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
