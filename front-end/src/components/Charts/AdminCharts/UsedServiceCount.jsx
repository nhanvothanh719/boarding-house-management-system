import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import {
  Legend,
  Bar,
  BarChart,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import AppUrl from "../../../RestAPI/AppUrl";

export default function UsedServiceCount() {
  const [usedServicesCount, setUsedServiceCount] = useState([]);
  const color = "#0091D5";

  useEffect(() => {
    axios.get(AppUrl.CountUsedServices).then((response) => {
      if (response.data.status === 200) {
        setUsedServiceCount(response.data.usedServicesCount);
      }
    });
  }, []);

  return (
    <Fragment>
      <div className="customChartContainer">
      <h3 className="customChartTitle">Chart title</h3>
      <BarChart width={730} height={250} data={usedServicesCount} style={{ flex: "5"}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="service_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name="Total uses" dataKey="total" fill={color} />
      </BarChart>
      </div>
    </Fragment>
  );
}
