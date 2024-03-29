import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import { Tooltip, Legend, Pie, PieChart, Cell } from "recharts";

import AppUrl from "../../../RestAPI/AppUrl";

export default function BalanceCategoryRate(props) {
  const [pieChartData, setPieChartData] = useState([]);
  const [balanceChanges, setBalanceChanges] = useState([]);
  const colors = ["#1C4E80", "#0091D5"];
  const [refreshChart, setRefreshChart] = useState(false);
  const chartTitle = "Income ratio";

  useEffect(() => {
    axios.get(AppUrl.GetRecentBalanceChanges).then((response) => {
      if (response.data.status === 200) {
        setBalanceChanges(response.data.recentBalanceChanges);
      }
    });
    axios.get(AppUrl.GetExpenseRatio).then((response) => {
      if (response.data.status === 200) {
        setPieChartData(response.data.pieData);
      }
    });
    setRefreshChart(props.isDataChange);
    if (props.isDataChange) {
      setRefreshChart(false);
    }
  }, [props.isDataChange]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{`${payload[0].name} - Total: ${payload[0].value.toFixed(
            2
          )}`}</label>
        </div>
      );
    }
    return null;
  };

  return (
    <Fragment>
      <div className="customChartContainer">
      <h3 className="customChartTitle">{chartTitle}</h3>
        <PieChart width={300} height={300}>
          <Pie
            data={pieChartData}
            dataKey="total"
            nameKey="description"
            cx="50%"
            cy="50%"
            outerRadius={120}
          >
            {balanceChanges.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </div>
    </Fragment>
  );
}
