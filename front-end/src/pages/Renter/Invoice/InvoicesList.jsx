import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";
import PaymentsIcon from '@mui/icons-material/Payments';

import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";
import WebPageTitle from "../../../components/WebPageTitle/WebPageTitle";

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
    { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
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
          <span className={`${rowData.payment !== null ? "statusActive" : "statusPassive"}` }>{rowData.payment !== null ? "Paid" : "Not yet" }</span>
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
      <div class="container">
        <div class="row mt-3">
          <div class="col-lg-12 right">
            <div class="box shadow-sm rounded bg-white mb-3">
              <div class="box-title border-bottom p-3">
                <h5 class="m-0 customDetailTitle">Unpaid invoices</h5> 
              </div>
              <div class="box-body p-0">
                <div class="p-3 align-items-center bg-light border-bottom osahan-post-header">
                  <MaterialTable
                    columns={columns}
                    data={unpaidInvoicesList}
                    title={<span className="customDatatableTitle">All unpaid invoices</span>}
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
                <h5 class="m-0 customDetailTitle">Paid invoices</h5>
              </div>
              <div class="box-body p-0">
                <div class="p-3 align-items-center bg-light border-bottom osahan-post-header">
                  <MaterialTable
                    columns={columns}
                    data={paidInvoicesList}
                    title={<span className="customDatatableTitle">All paid invoices</span>}
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
