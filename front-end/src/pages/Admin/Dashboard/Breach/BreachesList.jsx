import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import { IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateBreachModal from "../../../../components/Modals/Breach/CreateBreachModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";
import EditBreachModal from "../../../../components/Modals/Breach/EditBreachModal";

export default function BreachesList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breachesList, setBreachesList] = useState([]);
  const [breachesListChange, setBreachesListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBreachId, setSelectedBreachId] = useState(null);
  const severity = { 1: "Serious", 2: "Significant", 3: "Normal", 4: "Negligible", };
  const severityStyle = { 1: "statusPassive", 2: "statusPending", 3: "statusOnGoing", 4: "statusActive"};

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

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const setEditModalStatus = (status) => {
    setShowEditModal(status);
  };

  const updateModalStatus = (status) => {
    setBreachesListChange(status);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "name",
        title: "Name",
        width: "20%",
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
        field: "allowed_violate_number",
        title: "Allowed offenses number",
        width: "15%",
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
      {
        field: "severity_level",
        title: "Severity level",
        width: "15%",
        lookup: {
          1: "Serious",
          2: "Significant",
          3: "Normal",
          4: "Negligible",
        },
        render: (rowData) => {
          return (
              <span className={`${severityStyle[rowData.severity_level]}`}>{severity[rowData.severity_level]}</span>
          );
        },
      },
      // {
      //   field: "description",
      //   title: "Description",
      //   //editable: "never",
      //   render: (rowData) => (
      //     <Tooltip title="View description">
      //       <IconButton>
      //         <DescriptionIcon style={{ color: "black" }} />
      //       </IconButton>
      //     </Tooltip>
      //   ),
      // },
    ];

    if (loading) {
      return <Loading />;
    }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Breaches" />
      <div className="customDatatable">
          <div className="customDatatableHeader">
            <Button
              className="createBtn"
              style={{ backgroundColor: "white", color: "#1C4E80" }}
              onClick={(e) => setShowCreateModal(true)}
            >
              Add new breach
            </Button>
            <CreateBreachModal
        isShown={showCreateModal}
        setCreateModalStatus={setCreateModalStatus}
        updateModalStatus={updateModalStatus}
      />
          </div>
          <MaterialTable
        columns={columns}
        data={breachesList}
        title={<span className="customDatatableTitle">All breaches</span>}
        options={{
          searchAutoFocus: false,
          searchFieldVariant: "outlined",
          filtering: false,
          pageSizeOptions: [5, 10],
          paginationType: "stepped",
          exportButton: true,
          exportAllData: true,
          actionsColumnIndex: -1,
          headerStyle: {
            fontFamily: 'Anek Telugu, sans-serif',
          }
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit",
            onClick: (event, breach) => {
              setShowEditModal(true);
              setSelectedBreachId(breach.id);
            },
          },
        ]}
        editable={{
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
                    } else if (response.data.status === 400) {
                      swal("Warning", response.data.message, "warning");
                    }
                  });
                resolve();
              }, 1000);
            }),
        }}
      />
      <EditBreachModal
            isShown={showEditModal}
            breachId={selectedBreachId}
            setEditModalStatus={setEditModalStatus}
            updateModalStatus={updateModalStatus}
          />
          </div>
    </Fragment>
  );
}
