import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import { Legend, Pie, PieChart, Tooltip, Cell } from "recharts";

import AppUrl from "../../../RestAPI/AppUrl";

export default function RenterGenderRate() {
  const [rentersCount, setRentersCount] = useState([]);
  const colors = ["#1C4E80", "#0091D5"];
  const chartTitle = "Gender rates";

  useEffect(() => {
    axios.get(AppUrl.CountRentersByGender).then((response) => {
      if (response.data.status === 200) {
        setRentersCount(response.data.rentersCount);
      }
    });
  }, []);

  return (
    <Fragment>
      <div className="customChartContainer">
      <h3 className="customChartTitle">{chartTitle}</h3>
        <PieChart width={350} height={350}>
          <Pie
            data={rentersCount}
            dataKey="total"
            nameKey="gender"
            cx="50%"
            cy="50%"
            outerRadius={140}
          >
            {rentersCount.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </div>
    </Fragment>
  );
}
