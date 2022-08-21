import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AppUrl from "../../../RestAPI/AppUrl";

export default function AddBalanceChange(props) {
  const [input, setInput] = useState({
    description: "",
    is_income: "",
    amount: "",
  });
  const [errors, setErrors] = useState([]);
  const [occurredDate, setOccurredDate] = useState(moment());

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("addBalanceChangeModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addBalanceChangeModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setCreateModalStatus(false);
  };

  const addBalanceChange = (e) => {
    e.preventDefault();
    const data = {
      is_income: input.is_income,
      amount: input.amount,
      description: input.description,
      occurred_on: occurredDate,
    };
    axios
      .post(AppUrl.UpdateBalance, data)
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
        id="addBalanceChangeModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add change to balance
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
              <form className="" id="createCategoryForm">
                <div className="">
                  <label className="inputItemLabel">
                    Description (Source):
                  </label>
                  <input
                    type="text"
                    className=""
                    name="description"
                    onChange={handleInput}
                    value={input.description}
                    id="inputDescription"
                  />
                </div>
                <div className="">
                  <label>Category:</label>
                  <select
                    class="form-control"
                    name="is_income"
                    onChange={handleInput}
                    value={input.is_income}
                  >
                    <option selected>--- Select category ---</option>
                    <option value="0" key="0">
                      {" "}
                      Expenses{" "}
                    </option>
                    <option value="1" key="1">
                      {" "}
                      Earned{" "}
                    </option>
                  </select>
                </div>

                <div className="">
                  <label className="inputItemLabel">Amount:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="amount"
                    onChange={handleInput}
                    value={input.amount}
                    id="inputAmount"
                  />
                </div>
                <small className="text-danger">{errors.amount}</small>
                <div className="">
                  <label className="inputItemLabel">Occurred on:</label>
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
                      <TextField {...params} helperText={null} />
                    )}
                  />
                  </LocalizationProvider>
                </div>
                <small className="text-danger">{errors.occurred_on}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={addBalanceChange}
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
