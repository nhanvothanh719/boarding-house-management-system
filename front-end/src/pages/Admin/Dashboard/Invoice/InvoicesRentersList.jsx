import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function InvoicesRentersList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentersList, setRentersList] = useState([]);
  const [invoicesList, setInvoicesList] = useState([]);
  const [invoicesListChange, setInvoicesListChange] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.ShowRenters).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allRenters);
      }
    });
    axios.get(AppUrl.ShowInvoices).then((response) => {
      if (response.data.status === 200) {
        setInvoicesList(response.data.allInvoices);
      }
    });
    setLoading(false);
    if (invoicesListChange) {
      setInvoicesListChange(false);
    }
  }, [invoicesListChange]);

  var renters_columns = [];
  var invoices_columns = [];

  if (loading) {
    return <Loading />;
  } else {
    renters_columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
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
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "renter_id",
        title: "User",
        render: (rowData) => <p>{rowData.renter.name}</p>,
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
                onClick: (event, renter) => 
                history.push(`/admin/view-all-invoices-of-renter/${renter.id}`),
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
                icon: 'visibility',
                tooltip: 'Details',
                onClick: (event, invoice) =>
                  history.push(`/admin/invoice-details/${invoice.id}`),
              },
              {
                icon: 'edit',
                tooltip: 'Edit',
                onClick: (event, invoice) =>
                  history.push(`/admin/edit-invoice/${invoice.id}`),
              },
            ]}
            editable={{
              onRowDelete: (thisInvoice) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedInvoice = [...details];
                    const index = thisInvoice.tableData.id;
                    selectedInvoice.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteInvoice + thisInvoice.id)
                      .then((response) => {
                        if (response.data.status === 200) {
                          swal("Success", response.data.message, "success");
                          setInvoicesListChange(true);
                        } else if (response.data.status === 404) {
                          swal("Error", response.data.message, "error");
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </div>
      </Fragment>
    );
  }
}
