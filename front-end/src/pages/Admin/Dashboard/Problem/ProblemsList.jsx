import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function ProblemsList() {
  const history = useHistory();

  const [details] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [problemsListChange, setProblemsListChange] = useState(false);
  const [problemsList, setProblemsList] = useState([]);
  const [input, setInput] = useState({
    status: "",
  });

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
      {
        field: "replied_by",
        title: "Replied by",
        editable: "never",
        render: (rowData) => <p>{rowData.admin.name}</p>,
      },
      {
        field: "reply_content",
        title: "Reply content",
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
      />
    </Fragment>
  );
}
