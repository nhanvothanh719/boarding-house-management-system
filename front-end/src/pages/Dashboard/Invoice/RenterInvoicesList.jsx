import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import AppUrl from "../../../RestAPI/AppUrl";
import swal from "sweetalert";
import axios from "axios";
import Loading from "../../../components/Loading";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  BarChart,
  Label,
  Bar,
} from "recharts";

export default function RenterInvoicesList({ match }) {
  const history = useHistory();
  const renterId = match.params.renterID;
  const [invoicesList, setInvoicesList] = useState([]);
  const [usedServicesList, setUsedServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.GetRenterInvoices + renterId).then((response) => {
      if (response.data.status === 200) {
        setInvoicesList(response.data.allInvoices);
        setUsedServicesList(response.data.servicesCount);
        console.log(response.data.servicesCount);
      }
      setLoading(false);
    });
  }, [renterId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <p>All invoices of renter {renterId}</p>
      <div>
        {invoicesList.map((invoice) => {
          return <p>{invoice.id}</p>;
        })}
      </div>

      <p>Chart for viewing total of every month of the year</p>
      <AreaChart
        width={730}
        height={250}
        data={invoicesList}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month"/>
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>

      <p>Chart for used services </p>
      <BarChart
        width={1000}
        height={350}
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
        <Bar dataKey="total" fill="green">
          <LabelList dataKey="total" position="top"/>
        </Bar>
      </BarChart>
    </Fragment>
  );
}
