import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import PaymentsIcon from '@mui/icons-material/Payments';

import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";

export default function InvoicesList() {
  const history = useHistory();

  const [unpaidInvoicesList, setUnpaidInvoicesList] = useState([]);
  const [paidInvoicesList, setPaidInvoicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.ShowRenterInvoices).then((response) => {
      if (response.data.status === 200) {
        setUnpaidInvoicesList(response.data.unpaidInvoices);
        setPaidInvoicesList(response.data.paidInvoices);
      }
    });
    setLoading(false);
  }, []);

  var columns = [];
  columns = [
    { title: "#", render: (rowData) => rowData.tableData.id + 1 },
    { field: "total", title: "Total", editable: "never" },
    {
      field: "month",
      title: "Month",
      type: "numeric",
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
      render: (rowData) => moment(rowData.valid_until).format("DD/MM/YYYY"),
    },
    {
      field: "is_paid",
      title: "Paid",
      render: (rowData) => (
        <div>
          <span
            className={`${
              rowData.is_paid === 1 ? "statusActive" : "statusPassive"
            }`}
          >
            {rowData.is_paid === 1 ? "Paid" : "Not yet"}
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
      <div class="container">
        <div class="row mt-3">
          <div class="col-lg-12 right">
            <div class="box shadow-sm rounded bg-white mb-3">
              <div class="box-title border-bottom p-3">
                <h6 class="m-0">Unpaid invoices</h6>
              </div>
              <div class="box-body p-0">
                <div class="p-3 align-items-center bg-light border-bottom osahan-post-header">
                  <MaterialTable
                    columns={columns}
                    data={unpaidInvoicesList}
                    title="All renters' unpaid invoices"
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
                        icon: PaymentsIcon,
                        tooltip: "Pay invoice",
                        onClick: (event, invoice) =>
                          history.push(`/renter/view-unpaid-invoice-details/${invoice.id}`),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-lg-12 right">
            <div class="box shadow-sm rounded bg-white mb-3">
              <div class="box-title border-bottom p-3">
                <h6 class="m-0">Paid invoices</h6>
              </div>
              <div class="box-body p-0">
                <div class="p-3 align-items-center bg-light border-bottom osahan-post-header">
                  <MaterialTable
                    columns={columns}
                    data={paidInvoicesList}
                    title="All renters' unpaid invoices"
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
                          history.push(`/renter/view-paid-invoice-details/${invoice.id}`),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
