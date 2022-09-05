import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import moment from "moment";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import RenterBreachCount from "../../../../components/Charts/RenterBreachCount";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function RenterBreachDetails({ match }) {
  const renterId = match.params.renterID;
  const [breaches, setBreaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.GetRenterBreaches + renterId).then((response) => {
      if (response.data.status === 200) {
        setBreaches(response.data.renterBreaches);
      }
    });
    setLoading(false);
  }, [renterId]);

  var columns = [];
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "breach_id",
        title: "Breach name",
        render: (rowData) => <p>{rowData.breach.name}</p>,
      },
      {
        field: "violated_at",
        title: "Violate at",
        render: (rowData) =>
          moment(rowData.violated_at).format("hh:mm:ss - DD/MM/YYYY"),
      },
    ];

    if (loading) {
      return <Loading />;
    }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Renter's breach histories" />
      <RenterBreachCount renterId={renterId} />
      <div className="customDatatable">
      <MaterialTable
        columns={columns}
        data={breaches}
        title={<span className="customDatatableTitle">Renter's Breach Details</span>}
        options={{
          searchAutoFocus: false,
          searchFieldVariant: "outlined",
          filtering: false,
          pageSizeOptions: [5, 10],
          paginationType: "stepped",
          exportButton: true,
          exportAllData: true,
          actionsColumnIndex: -1,
          headerStyle: {
            fontFamily: 'Anek Telugu, sans-serif',
          }
        }}
      />
      </div>
    </Fragment>
  );
}
