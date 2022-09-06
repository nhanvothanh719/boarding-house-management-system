import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import axios from "axios";
import EmailIcon from '@mui/icons-material/Email';
import DraftsIcon from '@mui/icons-material/Drafts';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";
import WebPageTitle from "../../../components/WebPageTitle/WebPageTitle";
import CreateProblemModal from "../../../components/Modals/Problem/CreateProblemModal";
import EditProblemModal from "../../../components/Modals/Problem/EditProblemModal";

export default function ProblemsList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [problemsListChange, setProblemsListChange] = useState(false);
  const [problemsList, setProblemsList] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  

  const status = { 1: "Pending", 2: "On-going", 3: "Solved" };
  const statusStyle = { 1: "statusPending", 2: "statusOnGoing", 3: "statusActive"}; 
  const severity = { 1: "High", 2: "Normal", 3: "Low" };
  const severityStyle = { 1: "statusPassive", 2: "statusActive", 3: "statusOnGoing"};

  useEffect(() => {
    axios.get(AppUrl.ShowRenterProblems).then((response) => {
      if (response.data.status === 200) {
        setProblemsList(response.data.allProblems);
      }
    });
    setLoading(false);
    if (problemsListChange) {
      setProblemsListChange(false);
    }
  }, [problemsListChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const setEditModalStatus = (status) => {
    setShowEditModal(status);
  };

  const updateModalStatus = (status) => {
    setProblemsListChange(status);
  };


  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "title",
        title: "Title",
      },
      {
        field: "description",
        title: "Description",
      },
      {
        field: "severity_level",
        title: "Severity level",
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
        editable: "never",
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
      <div className="customDatatable">
      <div className="customDatatableHeader">
          <Button
              className="createBtn"
              style={{ backgroundColor: "white", color: "#1C4E80" }}
              onClick={(e) => setShowCreateModal(true)}
            >
              Add new problem
            </Button>
            <CreateProblemModal
              isShown={showCreateModal}
              setCreateModalStatus={setCreateModalStatus}
              updateModalStatus={updateModalStatus}
            />
          </div>
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
            onRowDelete: (thisProblem) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const selectedProblem = [...details];
                  const index = thisProblem.tableData.id;
                  selectedProblem.splice(index, 1); //1: only one record
                  axios
                    .delete(AppUrl.DeleteRenterProblem + thisProblem.id)
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
          detailPanel={[
            (rowData) => ({
              icon: EmailIcon,
              openIcon: DraftsIcon,
              tooltip: 'Show reply text',
              disabled: rowData.reply_text === null,
              render:  rowData => {
                return (
                  <div
                    style={{
                      fontSize: 15,
                      fontFamily: "Anek Telugu, sans-serif",
                      paddingLeft: 20,
                      paddingRingt: 25,
                      paddingTop: 10,
                      backgroundColor: '#eaeaea',
                      color: "#14213d"
                    }}
                  >
                    <span style={{ color: "#fca311" }}><ChatBubbleIcon className="pr-1"/> Reply from Admin: {" "}</span>
                    {rowData.reply_text}
                  </div>
                )
              },
            }),
          ]}
          actions={[
            {
              icon: "edit",
              tooltip: "Edit",
              onClick: (event, problem) => {
                setShowEditModal(true);
                setSelectedProblemId(problem.id);
              },
            },
          ]}
        />
      </div>
      <EditProblemModal
            isShown={showEditModal}
            problemId={selectedProblemId}
            setEditModalStatus={setEditModalStatus}
            updateModalStatus={updateModalStatus}
          />
    </Fragment>
  )
}
