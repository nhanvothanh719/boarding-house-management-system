import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import RenterInvoicePaid from "../../../../components/Charts/RenterInvoicePaid";
import RenterUsedServiceCount from "../../../../components/Charts/RenterUsedServiceCount";

export default function RenterInvoicesList({ match }) {
  const renterId = match.params.renterID;
  const [invoicesList, setInvoicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.GetRenterInvoices + renterId).then((response) => {
      if (response.data.status === 200) {
        setInvoicesList(response.data.allInvoices);
      }
    });
    setLoading(false);
  }, [renterId]);

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
      render: (rowData) =>
        moment(rowData.effective_from).format("DD/MM/YYYY"),
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
      <RenterInvoicePaid renterId={renterId} />
      <RenterUsedServiceCount renterId={renterId} />
      <div className="customDatatable">
        <div className="customDatatableHeader"></div>
        <MaterialTable
          columns={columns}
          data={invoicesList}
          title="All renters' invoices"
          options={{
            searchAutoFocus: false,
            searchFieldVariant: "outlined",
            filtering: false,
            pageSizeOptions: [5, 10],
            paginationType: "stepped",
            actionsColumnIndex: -1,
          }}
        />
      </div>
    </Fragment>
  );
}
