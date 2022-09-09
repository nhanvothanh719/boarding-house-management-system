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

export default function RenterBreachCount() {
  const [breachesTotal, setBreachesTotal] = useState([]);
  const colors = ["#1C4E80", "#EA6A47"];
  const chartTitle = "Total number of violations";
  useEffect(() => {
    axios.get(AppUrl.GetAllRenterBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreachesTotal(response.data.renterBreachDetails);
      }
    });
  }, []);
  return (
    <Fragment>
      <div className="customChartContainer">
        <h3 className="customChartTitle">{chartTitle}</h3>
        <BarChart
          width={1000}
          height={300}
          barSize={50}
          data={breachesTotal}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" name={<span style={{ fontSize:"17px", marginLeft: "10px", marginRight: "40px"}}>Total offenses number</span>} stackId="a" fill={colors[0]} />
          <Bar dataKey="allowed_violate_number" name={<span style={{ fontSize:"17px", marginLeft: "10px"  }}>Allowed offenses number</span>} stackId="a" fill={colors[1]} />
        </BarChart>
      </div>
    </Fragment>
  );
}
