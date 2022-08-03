import React, { Fragment, useState, useEffect } from "react";
import Loading from "../../../components/Loading";
import AppUrl from "../../../RestAPI/AppUrl";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

export default function CreateAnnouncement() {
  const [loading, setLoading] = useState(true);
  const [rentersList, setRentersList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [input, setInput] = useState({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowRenters).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allRenters);
      }
      setLoading(false);
    });
  }, []);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const sendAnnouncement = (e) => {
    e.preventDefault();
    var renters_id = [];
    if (selectedRows.length === 0) {
      swal("Error", "Cannot send due to no renter selected", "error");
    }
    selectedRows.map((row) => {
      return renters_id.push(row.id);
    });
    const data = {
      all_id: renters_id,
      title: input.title,
      content: input.content,
    };
    axios
      .post(AppUrl.SendAnnouncement, data)
      .then((response) => {
        if (response.data.status === 200) {
          //Delete input after submit the form
          document.getElementById("inputTitle").value = "";
          document.getElementById("inputContent").value = "";
          swal("Success", response.data.message, "success");
        } else if (response.data.status === 422) {
          swal("Inappropriate values", "", "error");
          setErrors(response.data.errors);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "id", title: "ID", align: "center", width: "5%" },
      // { field: "profile_picture", title: "Avatar", export: false, width: "10%", render: rowData => <img src={rowData.profile_picture} alt="avatar" style={{width: 40, borderRadius: '50%'}}/> },
      { field: "name", title: "Name", width: "20%" },
      { field: "email", title: "Email", width: "20%" },
    ];
  }

  return (
    <Fragment>
      <MaterialTable
        columns={columns}
        data={rentersList}
        title="Select renters to send announcement"
        onSelectionChange={(rows) => setSelectedRows(rows)}
        options={{
          searchAutoFocus: false,
          searchFieldVariant: "outlined",
          filtering: false,
          pageSizeOptions: [5, 10],
          paginationType: "stepped",
          exportButton: true,
          exportAllData: true,
          actionsColumnIndex: -1,
          selection: true,
        }}
      />
      <form
        className="flexForm"
        onSubmit={sendAnnouncement}
        id="createCategoryForm"
      >
        <div className="formInput">
          <label className="inputItemLabel">Title:</label>
          <input
            type="text"
            className="inputItem"
            name="title"
            onChange={handleInput}
            value={input.title}
            id="inputTitle"
          />
          <small>{errors.title}</small>
        </div>
        <div className="formInput">
          <label className="inputItemLabel">Content:</label>
          <textarea
            type="text"
            className="inputItem"
            name="content"
            onChange={handleInput}
            value={input.content}
            id="inputContent"
          />
          <small>{errors.content}</small>
        </div>
        <button className="btn btn-success" type="submit">
          Send to renter
        </button>
      </form>
      {/* <button className="btn btn-success" onClick={sendAnnouncement}>Send to renter</button> */}
    </Fragment>
  );
}
