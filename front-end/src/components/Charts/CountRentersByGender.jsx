import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import { Legend, Pie, PieChart, Tooltip } from "recharts";

import AppUrl from "../../RestAPI/AppUrl";

export default function CountRentersByGender() {
  const [rentersCount, setRentersCount] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    axios.get(AppUrl.CountRentersByGender).then((response) => {
      if (response.data.status === 200) {
        setRentersCount(response.data.rentersCount);
      }
    });
  }, []);

  return (
    <Fragment>
      <PieChart width={400} height={400}>
        <Pie
          data={rentersCount}
          dataKey="total"
          nameKey="gender"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
      </PieChart>
    </Fragment>
  );
}
