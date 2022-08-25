import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import AppUrl from "../../RestAPI/AppUrl";

export default function RenterInvoicePaid(props) {
  const [invoicesList, setInvoicesList] = useState([]);
  const color = "#202020";
  useEffect(() => {
    axios.get(AppUrl.GetRenterInvoices + props.renterId).then((response) => {
      if (response.data.status === 200) {
        setInvoicesList(response.data.allInvoices);
      }
    });
  }, [props.renterId]);
  return (
    <Fragment>
      <div className="customChartContainer">
        <h3 className="customChartTitle">Chart title</h3>
        <AreaChart
          width={500}
          height={250}
          data={invoicesList}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#202020" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1C4E80" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </div>
    </Fragment>
  );
}
