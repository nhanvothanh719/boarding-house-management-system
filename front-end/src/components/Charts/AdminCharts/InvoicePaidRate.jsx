import React, { Fragment, useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

export default function InvoicePaidRate() {
  const [paidInvoicesRate, setPaidInvoicesRate] = useState("");
  const [invoicePaidMethodsCount, setInvoicePaidMethodsCount] = useState([]);
  const colors = ["#EA6A47", "#1C4E80", "#A5D8DD"];
  const chartTitle = "Proportion of bills paid";
  
  useEffect(() => {
    axios.get(AppUrl.GetPaidInvoicesRate).then((response) => {
      if (response.data.status === 200) {
        setPaidInvoicesRate(response.data.paidInvoicesRate);
        setInvoicePaidMethodsCount(response.data.invoicePaidMethodsCount);
        console.log(response.data.paidInvoicesRate);
        console.log(response.data.invoicePaidMethodsCount);
      }
    });
  }, []);  

  return (
    <Fragment>
      <div className="customChartContainer">
      <h3 className="customChartTitle">{chartTitle}</h3>
        <PieChart width={300} height={300}>
          <Pie
            startAngle={90}
            endAngle={360 * paidInvoicesRate / 100 + 90}
            data={invoicePaidMethodsCount}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={123}
            label
            nameKey="method_name"
            dataKey="total"
          >
            {invoicePaidMethodsCount.map((entry, index) => (
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
