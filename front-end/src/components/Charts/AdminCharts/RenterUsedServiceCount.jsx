import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import { XAxis, YAxis, LabelList, BarChart, Bar } from "recharts";

import AppUrl from "../../../RestAPI/AppUrl";

export default function RenterUsedServiceCount(props) {
  const [usedServicesList, setUsedServicesList] = useState([]);
  const color = "#0091D5";
  const chartTitle = "Total usage of services";

  useEffect(() => {
    axios.get(AppUrl.GetRenterInvoices + props.renterId).then((response) => {
      if (response.data.status === 200) {
        setUsedServicesList(response.data.servicesCount);
      }
    });
  }, [props.renterId]);

  return (
    <Fragment>
      <div className="customChartContainer">
        <h3 className="customChartTitle">{chartTitle}</h3>
        <BarChart
          width={500}
          height={250}
          data={usedServicesList}
          margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="service_name"
            label={{ value: "Service name", position: "bottom" }}
          />
          <YAxis
            label={{
              value: "Number of uses",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Bar dataKey="total" fill={color}>
            <LabelList dataKey="total" position="top" />
          </Bar>
        </BarChart>
      </div>
    </Fragment>
  );
}