import React, { Fragment, useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

import axios from "axios";

import AppUrl from "../../RestAPI/AppUrl";

export default function GetPaidInvoicesRate() {
  const [paidInvoicesRate, setPaidInvoicesRate] = useState("");
  const [invoicePaidMethodsCount, setInvoicePaidMethodsCount] = useState([]);
  
  useEffect(() => {
    axios.get(AppUrl.GetPaidInvoicesRate).then((response) => {
      if (response.data.status === 200) {
        setPaidInvoicesRate(response.data.paidInvoicesRate);
        setInvoicePaidMethodsCount(response.data.invoicePaidMethodsCount);
      }
    });
  }, []);  

  return (
    <Fragment>
        <PieChart width={400} height={400}>
          <Pie
            startAngle={90}
            endAngle={360 * paidInvoicesRate / 100 - 90}
            data={invoicePaidMethodsCount}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            label
            nameKey="payment_method"
            dataKey="total"
          />
          <Tooltip />
        <Legend verticalAlign="top" height={36} />
        </PieChart>
    </Fragment>
  );
}
