import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import PaymentsIcon from "@mui/icons-material/Payments";

import Loading from "../../../../components/Loading/Loading";
import ConfirmLoading from "../../../../components/Loading/ConfirmLoading";
import AppUrl from "../../../../RestAPI/AppUrl";
import SelectRenterModal from "../../../../components/Modals/Invoice/SelectRenterModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";
import EditInvoiceModal from "../../../../components/Modals/Invoice/EditInvoiceModal";

export default function InvoicesList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderClass, setLoaderClass] = useState("d-none");
  const [displayComponentsClass, setDisplayComponentsClass] = useState("");
  const [invoicesList, setInvoicesList] = useState([]);
  const [invoicesListChange, setInvoicesListChange] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

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

  const setEditModalStatus = (status) => {
    setShowEditModal(status);
  };

  const updateModalStatus = (status) => {
    setInvoicesListChange(status);
  };

  const markAsPayByCash = (e, invoiceId) => {
    e.preventDefault();
    setLoaderClass('');
    setDisplayComponentsClass('d-none');
    const payment = {
      payment_method: "Cash",
      payment_id: "pay_by_cash_for_invoice_" + invoiceId,
    };
    axios.post(AppUrl.PayInvoiceByCash + invoiceId, payment).then((res) => {
      if (res.data.status === 200) {
        swal("Success", res.data.message, "success");
        setInvoicesListChange(true);
      } else if (res.data.status === 400) {
        swal("Warning", res.data.message, "warning");
      }
      setDisplayComponentsClass("");
      setLoaderClass("d-none");
    });
  };

  var columns = [];

  columns = [
    {
      title: "#",
      render: (rowData) => rowData.tableData.id + 1,
      width: "10%",
      align: "center",
    },
    {
      field: "renter_id",
      title: "User",
      editable: "never",
      width: "10%",
      render: (rowData) => <p>{rowData.renter.name}</p>,
    },
    {
      field: "total",
      title: "Total",
      width: "20%",
      editable: "never",
      align: "center",
    },
    {
      field: "month",
      title: "Month",
      width: "10%",
      type: "numeric",
      editable: "never",
      validate: (rowData) =>
        rowData.month < 1 ||
        rowData.month > 12 ||
        !Number.isInteger(rowData.month)
          ? { isValid: false, helperText: "Inappropriate month input" }
          : true,
    },
    {
      field: "effective_from",
      title: "Paid from",
      type: "date",
      editable: "never",
      render: (rowData) => moment(rowData.effective_from).format("DD/MM/YYYY"),
    },
    {
      field: "valid_until",
      title: "Paid until",
      type: "date",
      editable: "never",
      render: (rowData) => moment(rowData.valid_until).format("DD/MM/YYYY"),
    },
    {
      field: "is_paid",
      title: "Status",
      editable: "never",
      render: (rowData) => (
        <div>
          <span
            className={`${
              rowData.payment !== null ? "statusActive" : "statusPassive"
            }`}
          >
            {rowData.payment !== null ? "Paid" : "Not yet"}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Invoices" />
      <div className={loaderClass}>
        <ConfirmLoading />
      </div>
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
              (invoice) => ({
                icon: MoreTimeIcon,
                tooltip: "Add days for invoice payment",
                onClick: (event, invoice) => {
                  setShowEditModal(true);
                  setSelectedInvoiceId(invoice.id);
                },
                disabled: invoice.payment !== null,
              }),
              (invoice) => ({
                icon: PaymentsIcon,
                tooltip: "Pay by Cash",
                onClick: (event, invoice) => {
                  markAsPayByCash(event, invoice.id);
                },
                disabled:
                  invoice.payment != null ||
                  moment(invoice.valid_until) < moment(),
              }),
            ]}
            editable={{
              isDeletable: (rowData) => rowData.is_paid === 0,
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
                        } else if (response.data.status === 400) {
                          swal("Warning", response.data.message, "warning");
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </div>
        <EditInvoiceModal
          isShown={showEditModal}
          invoiceId={selectedInvoiceId}
          setLoaderClass={setLoaderClass}
          setDisplayComponentsClass={setDisplayComponentsClass}
          setEditModalStatus={setEditModalStatus}
          updateModalStatus={updateModalStatus}
        />
      </div>
    </Fragment>
  );
}
