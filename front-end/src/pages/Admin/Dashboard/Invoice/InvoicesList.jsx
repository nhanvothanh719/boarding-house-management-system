import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";

import Loading from "../../../../components/Loading/Loading";
import ConfirmLoading from "../../../../components/Loading/ConfirmLoading";
import AppUrl from "../../../../RestAPI/AppUrl";
import { Button } from "react-bootstrap";
import SelectRenterModal from "../../../../components/Modals/Invoice/SelectRenterModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function InvoicesList() {
  const history = useHistory();
  var currentDate = new Date();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderClass, setLoaderClass] = useState("d-none");
  const [displayComponentsClass, setDisplayComponentsClass] = useState("");
  const [invoicesList, setInvoicesList] = useState([]);
  const [invoicesListChange, setInvoicesListChange] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);

  useEffect(() => {
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

  const setSelectModalStatus = (status) => {
    setShowSelectModal(status);
  };

  var columns = [];

    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "renter_id",
        title: "User",
        editable: "never",
        width: "10%",
        render: (rowData) => <p>{rowData.renter.name}</p>,
      },
      { field: "total", title: "Total", width: "20%", editable: "never" , align: "center"},
      {
        field: "month",
        title: "Month",
        width: "10%",
        type: "numeric",
        validate: (rowData) =>
          rowData.month < 1 || rowData.month > 12 || !Number.isInteger(rowData.month)
            ? { isValid: false, helperText: "Inappropriate month input" }
            : true,
      },
      {
        field: "effective_from",
        title: "Paid from",
        type: "date",
        editable: "never",
        render: (rowData) =>
          moment(rowData.effective_from).format("DD/MM/YYYY"),
      },
      {
        field: "valid_until",
        title: "Paid until",
        type: "date",
        editable: ( row ,rowData ) => rowData.is_paid === 0,
        render: (rowData) => moment(rowData.valid_until).format("DD/MM/YYYY"),
        validate: (rowData) =>
          rowData.valid_until <= currentDate
            ? { isValid: false, helperText: "Inappropriate value" }
            : true,
      },
      { 
        field: "is_paid", 
        title: "Paid", 
        editable: ( row ,rowData ) => rowData.is_paid === 0, lookup: { 0: "Not yet", 1: "Paid" },
        render: rowData => (
          <div>
              <span className={`${rowData.is_paid === 1 ? "statusActive" : "statusPassive"}` }>{rowData.is_paid === 1 ? "Paid" : "Not yet" }</span>
          </div>
        )
      },
    ];

    if (loading) {
      return <Loading />;
    }
    return (
      <Fragment>
        <WebPageTitle pageTitle="Invoices" />
        <div className={loaderClass}><ConfirmLoading/></div>
        <div className={displayComponentsClass}>
        <div className="customDatatable">
          <div className="customDatatableHeader">
          <Button
              className="createBtn"
              style={{ backgroundColor: "white", color: "#1C4E80" }}
              onClick={(e) => setShowSelectModal(true)}
            >
              Add new invoice
            </Button>
            <SelectRenterModal
        isShown={showSelectModal}
        setCreateModalStatus={setSelectModalStatus}
      />
          </div>
          <MaterialTable
            columns={columns}
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
              isEditable: rowData => moment(rowData.valid_until) >= moment(currentDate).add(-2, 'days'),
              isDeletable: rowData => rowData.is_paid === 0,
              onRowUpdate: (newInvoice, oldInvoice) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    setLoaderClass('');
                    setDisplayComponentsClass('d-none');
                    const data = {
                      effective_from: moment(newInvoice.effective_until)
                        .utc()
                        .format("YYYY-MM-DD"),
                      valid_until: moment(newInvoice.valid_until)
                        .format("YYYY-MM-DD"),
                      month: newInvoice.month,
                      is_paid: newInvoice.is_paid,
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
                        setLoaderClass('d-none');
                        setDisplayComponentsClass('');
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
        </div>
      </Fragment>
    );
  }
