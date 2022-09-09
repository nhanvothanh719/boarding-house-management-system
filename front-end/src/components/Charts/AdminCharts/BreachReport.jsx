import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import AppUrl from "../../../RestAPI/AppUrl";

export default function BreachReport() {
  const [breachesInMonthCount, setBreachesInMonthCount] = useState([]);
  const color = "#f5f5f5";
  const chartTitle = "Number of breaches in year";

  useEffect(() => {
    axios.get(AppUrl.ReportBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreachesInMonthCount(response.data.breachesInMonthCount);
      }
    });
  }, []);

  return (
    <Fragment>
      <div className="customChartContainer">
      <h3 className="customChartTitle">{chartTitle}</h3>
      <ComposedChart
        width={620}
        height={350}
        data={breachesInMonthCount}
        margin={{
          top: 40,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke={color} />
        <XAxis dataKey="month" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          name="Total breaches in month"
          dataKey="total_breaches_in_month"
          barSize={20}
          fill="#1C4E80"
        />
        <Line
          name="Total breaches in month"
          type="monotone"
          dataKey="total_breaches_in_month"
          stroke="#ff7300"
        />
      </ComposedChart>
      </div>
    </Fragment>
  );
}
