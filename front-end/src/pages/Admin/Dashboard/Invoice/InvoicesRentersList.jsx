import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function InvoicesRentersList() {
  const history = useHistory();
  var currentDate = new Date();

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
      { title: "#", render: (rowData) => rowData.tableData.id + 1 },
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
      { title: "#", render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "renter_id",
        title: "User",
        editable: "never",
        render: (rowData) => <p>{rowData.renter.name}</p>,
      },
      { field: "total", title: "Total", editable: "never" },
      {
        field: "month",
        title: "Month",
        type: "numeric",
        validate: (rowData) =>
          rowData.month < 1 || rowData.month > 12 || !Number.isInteger(rowData.month)
            ? { isValid: false, helperText: "Inappropriate month input" }
            : true,
      },
      {
        field: "effective_from",
        title: "Can be paid from",
        type: "date",
        editable: "never",
        render: (rowData) =>
          moment(rowData.effective_from).format("DD/MM/YYYY"),
      },
      {
        field: "valid_until",
        title: "Can be paid until",
        type: "date",
        editable: ( row ,rowData ) => rowData.is_paid === 0,
        render: (rowData) => moment(rowData.valid_until).format("DD/MM/YYYY"),
        validate: (rowData) =>
          rowData.valid_until <= currentDate
            ? { isValid: false, helperText: "Inappropriate value" }
            : true,
      },
      { field: "is_paid", title: "Paid", editable: ( row ,rowData ) => rowData.is_paid === 0, lookup: { 0: "Not yet", 1: "Paid" } },
    ];
    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
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
                  history.push(
                    `/admin/view-all-invoices-of-renter/${renter.id}`
                  ),
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
                icon: "visibility",
                tooltip: "Details",
                onClick: (event, invoice) =>
                  history.push(`/admin/invoice-details/${invoice.id}`),
              },
            ]}
            editable={{
              onRowUpdate: (newInvoice, oldInvoice) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const data = {
                      effective_from: moment(newInvoice.effective_until)
                        .utc()
                        .format("YYYY-MM-DD"),
                      valid_until: moment(newInvoice.valid_until)
                        .utc()
                        .format("YYYY-MM-DD"),
                      month: newInvoice.month,
                    };
                    axios
                      .put(AppUrl.UpdateInvoice + oldInvoice.id, data)
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
