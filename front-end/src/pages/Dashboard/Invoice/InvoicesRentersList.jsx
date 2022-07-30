import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../../components/Loading";
import AppUrl from "../../../RestAPI/AppUrl";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

export default function InvoicesRentersList() {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [rentersList, setRentersList] = useState([]);
  const [invoicesList, setInvoicesList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowRenters).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allRenters);
      }
      setLoading(false);
    });
    axios.get(AppUrl.ShowInvoices).then((response) => {
      if (response.data.status === 200) {
        setInvoicesList(response.data.allInvoices);
        //console.log(response.data.allInvoices);
      }
    });
  }, []);

  const deleteInvoice = (e, id) => {
    e.preventDefault();
    const invoice = e.currentTarget;
    invoice.innerText = "Deleting";
    axios.delete(AppUrl.DeleteInvoice + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        //Delete table row
        invoice.closest("tr").remove();
      } else if (response.data.status === 404) {
        swal("Fail", response.data.message, "error");
        invoice.innerText = "Delete";
      }
    });
  };

  var renters_columns = [];
  var invoices_columns = [];
  let renterNames = [];
  let id;
  rentersList.forEach((renter) => {
    id = renter["id"];
    renterNames[id] = renter["name"];
  });

  if (loading) {
    return <Loading />;
  } else {
    renters_columns = [
      { field: "id", title: "ID", align: "center" },
      {
        field: "profile_picture",
        title: "Avatar",
        render: (rowData) => (
          <img
            src={rowData.profile_picture}
            alt="avatar"
            style={{ width: 40, borderRadius: "50%" }}
          />
        ),
      },
      { field: "name", title: "Name" },
      { field: "email", title: "Email" },
    ];

    invoices_columns = [
      { field: "id", title: "ID", align: "center" },
      {
        field: "renter_id",
        title: "User",
        render: (rowData) => <p>{renterNames[rowData.renter_id]}</p>,
      },
      { field: "total", title: "Total" },
      { field: "month", title: "Month" },
      { field: "effective_from", title: "Can be paid from" },
      { field: "valid_until", title: "Can be paid until" },
      { field: "is_paid", title: "Paid", lookup: { 0: "Not yet", 1: "Paid" } },
    ];
    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
            <Link to="/admin/create-renter" className="createBtn">
              Add new renter
            </Link>
          </div>
          <MaterialTable
            columns={renters_columns}
            data={rentersList}
            title="All renters"
            options={{
              searchAutoFocus: false,
              searchFieldVariant: "outlined",
              filtering: false,
              pageSizeOptions: [5, 10],
              paginationType: "stepped",
              actionsColumnIndex: -1,
            }}
            actions={[
              {
                icon: () => (
                  <button className="btn btn-primary">All invoices</button>
                ),
                onClick: (event, renter) => console.log(),
              },
              {
                icon: () => <button className="btn btn-success">Create</button>,
                onClick: (event, renter) =>
                  history.push(`/admin/create-invoice/${renter.id}`),
              },
            ]}
          />
          <MaterialTable
            columns={invoices_columns}
            data={invoicesList}
            title="All invoices"
            options={{
              searchAutoFocus: false,
              searchFieldVariant: "outlined",
              filtering: false,
              pageSizeOptions: [5, 10],
              paginationType: "stepped",
              actionsColumnIndex: -1,
            }}
            actions={[
              {
                icon: () => <button className="btn btn-info">Export</button>,
                onClick: (event, invoice) =>
                  history.push(`/admin/edit-invoice/${invoice.id}`),
              },
              {
                icon: () => <button className="btn btn-warning">Edit</button>,
                onClick: (event, invoice) =>
                  history.push(`/admin/edit-invoice/${invoice.id}`),
              },
              {
                icon: () => <button className="btn btn-danger">Delete</button>,
                onClick: (event, invoice) => deleteInvoice(event, invoice.id),
              },
            ]}
          />
        </div>
      </Fragment>
    );
  }
}
