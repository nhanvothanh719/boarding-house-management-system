import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateBreachModal from "../../../../components/Modals/Breach/CreateBreachModal";

export default function BreachesList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breachesList, setBreachesList] = useState([]);
  const [breachesListChange, setBreachesListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateCreateModalStatus = (status) => {
    setBreachesListChange(status);
  };

  useEffect(() => {
    axios.get(AppUrl.ShowBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreachesList(response.data.allBreaches);
        console.log(response.data.allBreaches);
      }
    });
    if (breachesListChange) {
      setBreachesListChange(false);
    }
    setLoading(false);
  }, [breachesListChange]);

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "name",
        title: "Name",
        validate: (rowData) => {
          if (rowData.name === "") {
            return "Name cannot be empty";
          }
          let breachNames = [];
          let breach_id = 0;
          breachesList.forEach((breach) => {
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
        field: "severity_level",
        title: "Severity level",
        lookup: {
          1: "Serious",
          2: "Significant",
          3: "Normal",
          4: "Negligible",
        },
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
        data={breachesList}
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
                  severity_level: newBreach.severity_level,
                  allowed_violate_number: newBreach.allowed_violate_number,
                };
                axios
                  .put(AppUrl.UpdateBreach + oldBreach.id, data)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setBreachesListChange(true);
                    } else if (response.data.status === 404) {
                      swal("Error", response.data.message, "error");
                    }
                  });
                resolve();
              }, 1000);
            }),
          onRowDelete: (thisBreach) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const selectedBreach = [...details];
                const index = thisBreach.tableData.id;
                selectedBreach.splice(index, 1); //1: only one record
                axios
                  .delete(AppUrl.DeleteBreach + thisBreach.id)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setBreachesListChange(true);
                    } else if (response.data.status === 404) {
                      swal("Error", response.data.message, "error");
                    }
                  });
                resolve();
              }, 1000);
            }),
        }}
      />
      <button
        className="btn btn-primary"
        onClick={(e) => setShowCreateModal(true)}
      >
        Add new breach
      </button>
      <CreateBreachModal
        isShown={showCreateModal}
        setCreateModalStatus={setCreateModalStatus}
        updateCreateModalStatus={updateCreateModalStatus}
      />
    </Fragment>
  );
}
