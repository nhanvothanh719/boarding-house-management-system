import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import AppUrl from "../../../RestAPI/AppUrl";
import SearchRenter from "../../Search/SearchRenter";
import SearchBreach from "../../Search/SearchBreach";

export default function CreateBreachHistoryModal(props) {
  const [errors, setErrors] = useState([]);
  const [violateMoment, setViolateMoment] = useState(moment());
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [selectedBreach, setSelectedBreach] = useState(null);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("addBreachHistoryModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addBreachHistoryModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setCreateModalStatus(false);
  };

  const getSelectedRenter = (renter) => {
    setSelectedRenter(renter);
  };

  const getSelectedBreach = (breach) => {
    setSelectedBreach(breach);
  };

  const addBreachHistory = (e) => {
    e.preventDefault();
    const data = {
      breach_id: selectedBreach.id,
      renter_id: selectedRenter.id,
      violated_at: moment(violateMoment).utc().format("YYYY-MM-DD hh:mm:ss"),
    };
    axios
      .post(AppUrl.StoreBreachHistory, data)
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
      <form
        class="modal fade"
        id="addBreachHistoryModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle" id="exampleModalLabel">
                Add new breach history
              </h5>
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
              <form className="flexForm">
                <div>
                  <label className="customModalLabel">Renter:</label>
                  <SearchRenter getSelectedRenter={getSelectedRenter}/>
                </div>
                <small className="text-danger">{errors.renter_id}</small>
                <div>
                  <label className="customModalLabel">Breach:</label>
                  <SearchBreach getSelectedBreach={getSelectedBreach}/>
                </div>
                <small className="text-danger">{errors.breach_id}</small>
                <div>
                  <label className="customModalLabel">Violate at:</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField fullWidth {...props} />}
                      label="Violate at"
                      value={violateMoment}
                      onChange={(selectMoment) => {
                        setViolateMoment(selectMoment);
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <small className="text-danger">{errors.violated_at}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={addBreachHistory}
              >
                Add
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
      </form>
    </Fragment>
  );
}
