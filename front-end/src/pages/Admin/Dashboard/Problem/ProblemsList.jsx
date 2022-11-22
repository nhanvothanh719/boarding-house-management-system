import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../../RestAPI/AppUrl";
import Loading from "../../../../components/Loading/Loading";
import ConfirmLoading from "../../../../components/Loading/ConfirmLoading";
import ReplyProblemModal from "../../../../components/Modals/Problem/ReplyProblemModal";
import ViewReplyProblemModal from "../../../../components/Modals/Problem/ViewProblemReplyModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function ProblemsList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderClass, setLoaderClass] = useState("d-none");
  const [displayComponentsClass, setDisplayComponentsClass] = useState("");
  const [problemsListChange, setProblemsListChange] = useState(false);
  const [problemsList, setProblemsList] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showReplyDetailsModal, setShowReplyDetailsModal] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const status = { 1: "Pending", 2: "On-going", 3: "Solved" };
  const statusStyle = { 1: "statusPending", 2: "statusOnGoing", 3: "statusActive"};
  const severity = { 1: "High", 2: "Normal", 3: "Low" };
  const severityStyle = { 1: "statusPassive", 2: "statusActive", 3: "statusOnGoing"};

  useEffect(() => {
    axios.get(AppUrl.ShowProblems).then((response) => {
      if (response.data.status == 200) {
        setProblemsList(response.data.allProblems);
      }
    });
    setLoading(false);
    if (problemsListChange) {
      setProblemsListChange(false);
    }
  }, [problemsListChange]);

  const setReplyModalStatus = (status) => {
    setShowReplyModal(status);
  };

  const setReplyDetailsModalStatus = (status) => {
    setShowReplyDetailsModal(status);
  };

  const updateProblemReplyStatus = (status) => {
    setProblemsListChange(status);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "renter_id",
        title: "Renter name",
        editable: "never",
        render: (rowData) => <p>{rowData.renter.name}</p>,
      },
      {
        field: "title",
        title: "Title",
        editable: "never",
      },
      {
        field: "severity_level",
        title: "Severity level",
        editable: "never",
        lookup: { 1: "High", 2: "Normal", 3: "Low" },
        render: (rowData) => {
          return (
              <span className={`${severityStyle[rowData.severity_level]}`}>{severity[rowData.severity_level]}</span>
          );
        },
      },
      {
        field: "status",
        title: "Status",
        lookup: { 1: "Pending", 2: "On-going", 3: "Solved" },
        render: (rowData) => {
          return (
              <span className={`${statusStyle[rowData.status]}`}>{status[rowData.status]}</span>
          );
        },
      },
    ];

    if (loading) {
      return <Loading />;
    }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Problems" />
      <div className={loaderClass}><ConfirmLoading/></div>
        <div className={displayComponentsClass}>
        <div className="customDatatable">
        <MaterialTable
          columns={columns}
          data={problemsList}
          title={<span className="customDatatableTitle">Renters' problems</span>}
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
              fontFamily: "Anek Telugu, sans-serif",
            },
          }}
          editable={{
            onRowUpdate: (newProblem, oldProblem) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const data = {
                    status: newProblem.status,
                  };
                  axios
                    .put(AppUrl.UpdateProblemStatus + oldProblem.id, data)
                    .then((response) => {
                      if (response.data.status == 200) {
                        swal("Success", response.data.message, "success");
                        setProblemsListChange(true);
                      } else if (response.data.status == 404) {
                        swal("Error", response.data.message, "error");
                      }
                    });
                  resolve();
                }, 1000);
              }),
            onRowDelete: (thisProblem) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const selectedProblem = [...details];
                  const index = thisProblem.tableData.id;
                  selectedProblem.splice(index, 1); //1: only one record
                  axios
                    .delete(AppUrl.DeleteProblem + thisProblem.id)
                    .then((response) => {
                      if (response.data.status == 200) {
                        swal("Success", response.data.message, "success");
                        setProblemsListChange(true);
                      } else if (response.data.status == 404) {
                        swal("Error", response.data.message, "error");
                      }
                    });
                  resolve();
                }, 1000);
              }),
          }}
          actions={[
            {
              icon: "visibility",
              tooltip: "Details",
              onClick: (event, problem) => {
                setShowReplyDetailsModal(true);
                setSelectedProblemId(problem.id);
              },
            },
            (rowData) => ({
              icon: "reply",
              tooltip: "Reply",
              onClick: (event, problem) => {
                setShowReplyModal(true);
                setSelectedProblemId(problem.id);
              },
              disabled: rowData.replied_by !== null,
            }),
          ]}
        />
        <ViewReplyProblemModal
          isShown={showReplyDetailsModal}
          setReplyDetailsModalStatus={setReplyDetailsModalStatus}
          problemId={selectedProblemId}
        />
        <ReplyProblemModal
          isShown={showReplyModal}
          setLoaderClass={setLoaderClass}
          setDisplayComponentsClass={setDisplayComponentsClass}
          setReplyModalStatus={setReplyModalStatus}
          updateProblemReplyStatus={updateProblemReplyStatus}
          problemId={selectedProblemId}
        />
      </div>
        </div>
    </Fragment>
  );
}
