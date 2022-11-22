import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";
import WebPageTitle from "../../../components/WebPageTitle/WebPageTitle";

export default function ServiceRegistration() {
  const [loading, setLoading] = useState(true);
  const [registeredServicesList, setRegisteredServicesList] = useState([]);
  const isCompulsory = ["Optional", "Compulsory"];
  const isCompulsoryStyle = ["statusActive", "statusPassive"];

  useEffect(() => {
    axios.get(AppUrl.GetRenterRegisteredServices).then((response) => {
      if (response.data.status === 200) {
        setRegisteredServicesList(response.data.allServices);
        console.log(response.data.allServices);
      }
    });
    setLoading(false);
  }, []);

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "name",
        title: "Service name",
      },
      {
        field: "is_compulsory",
        title: "Category",
        lookup: { 1: "Compulsory", 2: "Optional" },
        render: rowData => (
          <div>
          <span
            className={`${isCompulsoryStyle[rowData.is_compulsory]}`}>
            {isCompulsory[rowData.is_compulsory]}
          </span>
        </div>
        )
      },
      {
        field: "unit",
        title: "Unit",
      },
      {
        field: "unit_price",
        title: "Unit price",
      },
    ];

    if (loading) {
      return <Loading />;
    }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Registered services" />
        <div className="customDatatable">
          <div className="customDatatableHeader">
          </div>
          <MaterialTable
            columns={columns}
            data={registeredServicesList}
            title={<span className="customDatatableTitle">All registered services</span>}
            options={{
              searchAutoFocus: false,
              searchFieldVariant: "outlined",
              filtering: false,
              pageSizeOptions: [5, 10],
              paginationType: "stepped",
              exportButton: false,
              exportAllData: true,
              actionsColumnIndex: -1,
              headerStyle: {
                fontFamily: 'Anek Telugu, sans-serif',
              }
            }}
          />
        </div>
      </Fragment>
  )
}
