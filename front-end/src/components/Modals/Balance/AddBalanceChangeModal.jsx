import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import AppUrl from "../../../RestAPI/AppUrl";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function AddBalanceChangeModal(props) {
  const [input, setInput] = useState({
    description: "",
    amount: "",
  });
  const [errors, setErrors] = useState([]);
  const [occurredDate, setOccurredDate] = useState(moment());
  const [selectBalanceCategory, setSelectBalanceCategory] = useState(0);

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
      is_income: selectBalanceCategory,
      amount: input.amount,
      description: input.description,
      occurred_on: moment(occurredDate).format("YYYY-MM-DD hh:mm:ss"),
    };
    axios
      .post(AppUrl.UpdateBalance, data)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          setInput({
            description: "",
            amount: "",
          });
          setOccurredDate(moment());
          setSelectBalanceCategory(0);
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
        id="addBalanceChangeModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle" id="exampleModalLabel">
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
                <small className="text-danger customSmallError" >{errors.description}</small>
                <div className="">
                  <label className="customModalLabel">Category:</label>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      //name="gender"
                      onChange={(e) => setSelectBalanceCategory(e.target.value)}
                      value={selectBalanceCategory}
                      required
                    >
                      <MenuItem
                        value={0}
                        style={{ display: "block", padding: "5px 30px 5px" }}
                      >
                        Expenses
                      </MenuItem>
                      <MenuItem
                        value={1}
                        style={{ display: "block", padding: "5px 30px 5px" }}
                      >
                        Earned
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <small className="text-danger customSmallError" >{errors.is_income}</small>
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
                <small className="text-danger customSmallError" >{errors.amount}</small>
                <div className="">
                  <label className="customModalLabel">Occurred on:</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
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
                <small className="text-danger customSmallError" >{errors.occurred_on}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
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
