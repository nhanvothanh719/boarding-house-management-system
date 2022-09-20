import React, { Fragment, useEffect, useState } from "react";

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

import AppUrl from "../../../RestAPI/AppUrl";

export default function RenterBreachCount(props) {
  const [breachesTotal, setBreachesTotal] = useState([]);
  const color = "#1C4E80";
  const chartTitle = "Total number of breaches";

  useEffect(() => {
    axios.get(AppUrl.CountRenterBreaches + props.renterId).then((response) => {
      if (response.data.status === 200) {
        setBreachesTotal(response.data.breachesTotal);
        console.log(response.data.breachesTotal);
      }
    });
  }, [props.renterId]);
  return (
    <Fragment>
      <div className="customChartContainer">
        <h3 className="customChartTitle">{chartTitle}</h3>
        <BarChart width={1050} height={250} barSize={50} data={breachesTotal}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="breach_name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill={color} name="Total"/>
        </BarChart>
      </div>
    </Fragment>
  );
}
