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

import AppUrl from "../../RestAPI/AppUrl";

export default function CountUsedServices() {
  const [usedServicesCount, setUsedServiceCount] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.CountUsedServices).then((response) => {
      if (response.data.status === 200) {
        setUsedServiceCount(response.data.usedServicesCount);
      }
    });
  }, []);

  return (
    <Fragment>
      <BarChart width={730} height={250} data={usedServicesCount}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="service_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name="Total uses" dataKey="total" fill="#82ca9d" />
      </BarChart>
    </Fragment>
  );
}
