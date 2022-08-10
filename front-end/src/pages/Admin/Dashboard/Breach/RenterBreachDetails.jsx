import React, { Fragment, useState, useEffect } from "react";
import MaterialTable from "material-table";
import swal from "sweetalert";
import moment from "moment";
import axios from "axios";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function RenterBreachDetails({ match }) {
  const renterId = match.params.renterID;
  const [breaches, setBreaches] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breachesList, setBreachesList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.GetRenterBreaches + renterId).then((response) => {
      if (response.data.status === 200) {
        setBreaches(response.data.renterBreaches);
      }
      setLoading(false);
    });
    axios.get(AppUrl.ShowBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreachesList(response.data.allBreaches);
      }
    });
    axios.get(AppUrl.CountRenterBreaches + renterId).then((response) => {
      if (response.data.status === 200) {
        setChartData(response.data.breachesTotal);
        console.log(response.data.breachesTotal);
      }
    })
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
        render: (rowData) => <p>{breachNames[rowData.breach_id]}</p>,
      },
      {
        field: "violate_at",
        title: "Violate at",
        render: rowData => moment(rowData.violate_at).format('hh:mm:ss - DD/MM/YYYY')
      },
    ];
  }

  let breachNames = [];
  let id;
  breachesList.forEach((breach) => {
    id = breach["id"];
    breachNames[id] = breach["name"];
  })


  return (
  <Fragment>
    <div>Renter's Breach Details {renterId}</div>
    <BarChart width={730} height={250} data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="breach_name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="total" fill="#8884d8" />
</BarChart>
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
