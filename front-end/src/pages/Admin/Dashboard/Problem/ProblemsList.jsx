import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import ReplyProblemModal from "../../../../components/Modals/ReplyProblemModal";

export default function ProblemsList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [problemsListChange, setProblemsListChange] = useState(false);
  const [problemsList, setProblemsList] = useState([]);
  const [input, setInput] = useState({
    status: "",
  });
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.ShowProblems).then((response) => {
      if (response.data.status === 200) {
        setProblemsList(response.data.allProblems);
      }
    });
    setLoading(false);
    if (problemsListChange) {
      setProblemsListChange(false);
    }
  }, [problemsListChange]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const setModalStatus = (status) => {
    setShowReplyModal(status);
  }

  const updateProblemReplyStatus = (status) => {
    setProblemsListChange(status);
  }

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "id", title: "ID", align: "center", editable: "never" },
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
        field: "description",
        title: "Description",
        editable: "never",
      },
      {
        field: "severity_level",
        title: "Severity level",
        editable: "never",
        lookup: { 1: "High", 2: "Normal", 3: "Low" }
      },
      {
        field: "status",
        title: "Status",
        lookup: { 1: "Pending", 2: "On-going", 3: "Solved" }
      },
    ];
  }

  return (
    <Fragment>
        <MaterialTable
        columns={columns}
        data={problemsList}
        title="Renters' problems List"
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
          onRowUpdate: (newProblem, oldProblem) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const data = {
                  status: newProblem.status,
                };
                axios
                  .put(AppUrl.UpdateProblemStatus + oldProblem.id, data)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setProblemsListChange(true);
                    } else if (response.data.status === 404) {
                      swal("Error", response.data.message, "error");
                    }
                  });
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldProblem) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const selectedProblem = [...details];
                const index = oldProblem.tableData.id;
                selectedProblem.splice(index, 1); //1: only one record
                axios
                  .delete(AppUrl.DeleteProblem + oldProblem.id)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setProblemsListChange(true);
                    } else if (response.data.status === 404) {
                      swal("Error", response.data.message, "error");
                    }
                  });
                resolve();
              }, 1000);
            }),
        }}
        actions={[
          {
            icon: 'visibility',
            tooltip: 'Details',
            onClick: (event, room_contract) => 
            history.push(`/admin/view-room-contract-details/${room_contract.id}`),
          },
          rowData => ({
            icon: 'reply',
            tooltip: 'Reply',
            onClick: (event, problem) => {
              setShowReplyModal(true);
              setSelectedProblemId(problem.id);
            },
            disabled: rowData.replied_by !== null
          }),
        ]}
      />
      <ReplyProblemModal isShown = {showReplyModal} setModalStatus = {setModalStatus} updateProblemReplyStatus = {updateProblemReplyStatus} problemId = {selectedProblemId}/>
    </Fragment>
  );
}
