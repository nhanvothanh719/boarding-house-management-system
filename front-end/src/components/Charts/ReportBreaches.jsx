import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } from 'recharts';

  import AppUrl from "../../RestAPI/AppUrl";

export default function ReportBreaches() {
  const [breachesInMonthCount, setBreachesInMonthCount] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ReportBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreachesInMonthCount(response.data.breachesInMonthCount);
        console.log(response.data.breachesInMonthCount);
      }
    });
  }, []);

  return (
    <Fragment>
        <ComposedChart
          width={500}
          height={400}
          data={breachesInMonthCount}
          margin={{
            top: 40,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="month" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="Total breaches in month" dataKey="total_breaches_in_month" barSize={20} fill="#413ea0" />
          <Line name="Total breaches in month" type="monotone" dataKey="total_breaches_in_month" stroke="#ff7300" />
        </ComposedChart>
    </Fragment>
  )
}
