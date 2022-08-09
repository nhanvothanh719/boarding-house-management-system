import React, { Fragment, useState, useEffect } from "react";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function BreachHistories() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breachHistories, setBreachHistories] = useState([]);
  const [input, setInput] = useState({
    breach_id: "",
    renter_id: "",
  });
  const [details] = useState([]);
  const [breachHistoriesChange, setBreachHistoriesChange] = useState(false);
  const [breachesList, setBreachesList] = useState([]);
  const [violateMoment, setViolateMoment] = useState(moment());

  useEffect(() => {
    axios.get(AppUrl.ShowBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreachesList(response.data.allBreaches);
      }
    });
    axios.get(AppUrl.ShowBreachHistories).then((response) => {
      if (response.data.status === 200) {
        setBreachHistories(response.data.allBreachHistories);
      }
      setLoading(false);
    });
    if (breachHistoriesChange) {
      setBreachHistoriesChange(false);
    }
  }, [breachHistoriesChange]);

  const showModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addBreachHistoryModal")
    );
    model.show();
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const addBreachHistory = (e) => {
    e.preventDefault();
    const data = {
      breach_id: input.breach_id,
      renter_id: input.renter_id,
      violate_at: moment(violateMoment).utc().format("YYYY-MM-DD hh:mm:ss"),
    };
    axios
      .post(AppUrl.StoreBreachHistory, data)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          //Delete input after submit the form
          setInput({
            breach_id: "",
            renter_id: "",
          });
          setViolateMoment(moment());
          swal("Success", response.data.message, "success");
          setBreachHistoriesChange(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            showModal();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const findUser = (e) => {
    e.preventDefault();
    if (input.renter_id) {
      axios
        .get(AppUrl.FindName + input.renter_id)
        .then((response) => {
          if (response.data.status === 200) {
            swal("User found", response.data.name, "success");
          } else if (response.data.status === 404) {
            swal("No user found", response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "id", title: "ID", align: "center", editable: "never" },
      {
        field: "breach_id",
        title: "Breach name",
      },
      {
        field: "renter_id",
        title: "Renter",
      },
      {
        field: "violate_at",
        title: "Violate at",
        type: "datetime",
      },
    ];
  }

  return (
    <Fragment>
      <MaterialTable
        columns={columns}
        data={breachHistories}
        title="Breach histories"
        options={{
          searchAutoFocus: false,
          searchFieldVariant: "outlined",
          filtering: false,
          pageSizeOptions: [5, 10],
          paginationType: "stepped",
          exportButton: true,
          exportAllData: true,
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowDelete: (oldBreachHistory) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const selectBreachHistory = [...details];
                const index = oldBreachHistory.tableData.id;
                selectBreachHistory.splice(index, 1); //1: only one record
                axios
                  .delete(AppUrl.DeleteBreachHistory + oldBreachHistory.id)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setBreachHistoriesChange(true);
                    } else if (response.data.status === 404) {
                      swal("Error", response.data.message, "error");
                    }
                  });
                resolve();
              }, 1000);
            }),
        }}
      />

      <button className="btn btn-primary" onClick={showModal}>
        Add new breach history
      </button>

      <form
        class="modal fade"
        id="addBreachHistoryModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add new breach history
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form className="flexForm">
                <div className="formInput">
                  <label className="inputItemLabel">Renter ID:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="renter_id"
                    onChange={handleInput}
                    value={input.renter_id}
                  />
                </div>
                <button onClick={findUser}>Find person</button>
                <small className="text-danger">{errors.renter_id}</small>
                <div className="formInput">
                  <label className="inputItemLabel">Breach:</label>
                  <select
                    className="form-control"
                    name="breach_id"
                    onChange={handleInput}
                    value={input.breach_id}
                  >
                    <option selected>--- Select breach ---</option>
                    {breachesList.map((breach) => {
                      return (
                        <option value={breach.id} key={breach.id}>
                          {" "}
                          {breach.name}{" "}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <small className="text-danger">{errors.breach_id}</small>
                <div className="">
                  <label className="inputItemLabel">Violate at:</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      // label="Violate moment"
                      value={violateMoment}
                      onChange={(selectMoment) => {
                        setViolateMoment(selectMoment);
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <small className="text-danger">{errors.violate_at}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={addBreachHistory}
              >
                Add
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </form>

      <button className="btn btn-info">Summarize histories</button>
    </Fragment>
  );
}
