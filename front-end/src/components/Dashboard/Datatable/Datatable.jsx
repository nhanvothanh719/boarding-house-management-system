import React, { Fragment } from "react";
import "../../../assets/css/Dashboard/datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../Datatable/DataSource";
import { Link } from "react-router-dom";

function Datatable() {
  // Not depend on any datatable
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: () => {
        return (
          <div className="cellAction">
            <div className="viewBtn">Details</div>
            <div className="editBtn">Edit</div>
            <div className="deleteBtn">Delete</div>
          </div>
        );
      },
    },
  ];
  return (
    <Fragment>
      <div className="customDatatable">
        <div className="datatableHeader">
          <Link to="/renters/1" className="createBtn">
            Add new instance
          </Link>
        </div>
        <DataGrid
          rows={userRows}
          // columns={userColumns}
          columns={userColumns.concat(actionColumn)}
          pageSize={8}
          rowsPerPageOptions={[8]}
          checkboxSelection
        />
      </div>
    </Fragment>
  );
}

export default Datatable;
