import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import {
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
  } from "recharts";

import AppUrl from "../../RestAPI/AppUrl";

export default function BalanceVariation() {
    const [balanceChanges, setBalanceChanges] = useState([]);
    const color = "#1C4E80";

    useEffect(() => {
        axios.get(AppUrl.GetRecentBalanceChanges).then((response) => {
            if (response.data.status === 200) {
              setBalanceChanges(response.data.recentBalanceChanges);
            }
          });
    }, []);
  return (
    <Fragment>
        <div className="customChartContainer">
        <h3 className="customChartTitle">Chart title</h3>
        <LineChart
        width={670}
        height={300}
        data={balanceChanges}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="occurred_on" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke={color} />
      </LineChart>
        </div>
    </Fragment>
  )
}
