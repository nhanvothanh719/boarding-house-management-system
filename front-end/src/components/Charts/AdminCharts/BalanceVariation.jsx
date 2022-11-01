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

import AppUrl from "../../../RestAPI/AppUrl";

export default function BalanceVariation(props) {
    const [balanceChanges, setBalanceChanges] = useState([]);
    const [refreshChart, setRefreshChart] = useState(false);
    const color = "#1C4E80";
    const chartTitle = "Recent balance changes";

    useEffect(() => {
        axios.get(AppUrl.GetRecentBalanceChanges).then((response) => {
            if (response.data.status === 200) {
              setBalanceChanges(response.data.recentBalanceChanges);
            }
          });
          setRefreshChart(props.isDataChange);
          if (props.isDataChange) {
            setRefreshChart(false);
          }
    }, [props.isDataChange]);
  return (
    <Fragment>
        <div className="customChartContainer">
        <h3 className="customChartTitle">{chartTitle}</h3>
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
        <Line type="monotone" dataKey="amount" stroke={color} name="Balance change amount"/>
      </LineChart>
        </div>
    </Fragment>
  )
}
