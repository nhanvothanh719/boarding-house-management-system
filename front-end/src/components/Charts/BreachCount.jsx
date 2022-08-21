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
  LabelList,
} from "recharts";

import AppUrl from "../../RestAPI/AppUrl";

export default function BreachCount() {
  const [breachesTotal, setBreachesTotal] = useState([]);
  const color = "#0091D5";

  useEffect(() => {
    axios.get(AppUrl.GetTotalNumberBreachMade).then((response) => {
      if (response.data.status === 200) {
        setBreachesTotal(response.data.breachTotals);
      }
    });
  }, []);

  return (
    <Fragment>
      <div className="customChartContainer">
        <h3 className="customChartTitle">Chart title</h3>
        <BarChart
          width={500}
          height={300}
          data={breachesTotal}
          margin={{ top: 30, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill={color}>
            <LabelList dataKey="total" position="top" />
          </Bar>
        </BarChart>
      </div>
    </Fragment>
  );
}
