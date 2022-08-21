import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import moment from "moment";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import RenterBreachCount from "../../../../components/Charts/RenterBreachCount";

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
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "id", title: "ID", align: "center", editable: "never" },
      {
        field: "breach_id",
        title: "Breach name",
        render: (rowData) => <p>{rowData.breach.name}</p>,
      },
      {
        field: "violate_at",
        title: "Violate at",
        render: (rowData) =>
          moment(rowData.violate_at).format("hh:mm:ss - DD/MM/YYYY"),
      },
    ];
  }

  return (
    <Fragment>
      <div>Renter's Breach Details {renterId}</div>
      <RenterBreachCount renterId={renterId} />
      <MaterialTable
        columns={columns}
        data={breaches}
        title="Breach histories"
        options={{
          searchAutoFocus: false,
          searchFieldVariant: "outlined",
          filtering: false,
          pageSizeOptions: [5, 10],
          paginationType: "stepped",
          exportButton: true,
          exportAllData: true,
          actionsColumnIndex: -1,
        }}
      />
    </Fragment>
  );
}
