import React, { Fragment, useState, useEffect } from "react";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function BreachesList() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breaches, setBreaches] = useState([]);
  const [input, setInput] = useState({
    name: "",
    description: "",
    allowed_violate_number: "",
  });
  const [details] = useState([]);
  const [breachChange, setBreachChange] = useState(false);

  const showModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addBreachModal")
    );
    model.show();
  };

  useEffect(() => {
    axios.get(AppUrl.ShowBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreaches(response.data.allBreaches);
        console.log(response.data.allBreaches);
      }
      setLoading(false);
    });
    if (breachChange) {
      setBreachChange(false);
    }
  }, [breachChange]);

  const addBreach = (e) => {
    e.preventDefault();
    const breach = {
      name: input.name,
      description: input.description,
      allowed_violate_number: input.allowed_violate_number,
    };
    axios
      .post(AppUrl.StoreBreach, breach)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          //Delete input after submit the form
          setInput({
            name: "",
            description: "",
            allowed_violate_number: "",
          });
          swal("Success", response.data.message, "success");
          setBreachChange(true);
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

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "id", title: "ID", align: "center", editable: "never" },
      {
        field: "name",
        title: "Name",
        validate: (rowData) => {
          if (rowData.name === "") {
            return "Name cannot be empty";
          }
          let breachNames = [];
          let breach_id = 0;
          breaches.forEach((breach) => {
            breach_id = breach["id"];
            breachNames[breach_id] = breach["name"];
          });
          var otherBreachNames = breachNames.filter(function (breachName) {
            //Return all values in array except the filtered object
            return breachName !== breachNames[rowData.id]; //Condition
          });
          //Check unique
          if (otherBreachNames.includes(rowData.name)) {
            return "Name has already taken";
          }
          return true;
        },
      },
      {
        field: "description",
        title: "Description",
      },
      {
        field: "allowed_violate_number",
        title: "Number of offenses allowed",
        type: "numeric",
        validate: (rowData) => {
          if (!Number.isInteger(rowData.allowed_violate_number)) {
            return "Input must be integer data type";
          } else if (rowData.allowed_violate_number <= 0) {
            return "Input number must be bigger than 0";
          } else if (rowData.allowed_violate_number >= 10) {
            return "Input number must be smaller than 10";
          }
          return true;
        },
      },
    ];
  }

  return (
    <Fragment>
      <MaterialTable
        columns={columns}
        data={breaches}
        title="Breaches list"
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
          onRowUpdate: (newBreach, oldBreach) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const data = {
                  name: newBreach.name,
                  description: newBreach.description,
                  allowed_violate_number: newBreach.allowed_violate_number,
                };
                axios
                  .put(AppUrl.UpdateBreach + oldBreach.id, data)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setBreachChange(true);
                    } else if (response.data.status === 404) {
                      swal("Error", response.data.message, "error");
                    }
                  });
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldBreach) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const selectBreach = [...details];
                const index = oldBreach.tableData.id;
                selectBreach.splice(index, 1); //1: only one record
                axios
                  .delete(AppUrl.DeleteBreach + oldBreach.id)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setBreachChange(true);
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
        Add new breach
      </button>
      <form
        class="modal fade"
        id="addBreachModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
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
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form className="flexForm">
                <div className="formInput">
                  <label className="inputItemLabel">Name:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="name"
                    onChange={handleInput}
                    value={input.name}
                    id="inputName"
                  />
                </div>
                <small className="text-danger">{errors.name}</small>
                <div className="formInput">
                  <label className="inputItemLabel">Description:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="description"
                    onChange={handleInput}
                    value={input.description}
                    id="inputDescription"
                  />
                </div>
                <small className="text-danger">{errors.description}</small>
                <div className="formInput">
                  <label className="inputItemLabel">
                    Number of offenses allowed:
                  </label>
                  <input
                    type="text"
                    className="inputItem"
                    name="allowed_violate_number"
                    onChange={handleInput}
                    value={input.allowed_violate_number}
                    id="inputAllowedViolateNumber"
                  />
                </div>
                <small className="text-danger">
                  {errors.allowed_violate_number}
                </small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={addBreach}
              >
                Create
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
    </Fragment>
  );
}
