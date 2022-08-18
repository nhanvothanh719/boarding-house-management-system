import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import { Legend, Pie, PieChart, Tooltip } from "recharts";

import AppUrl from "../../RestAPI/AppUrl";

export default function CountRoomsByStatus() {
  const [roomsCount, setRoomsCount] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.CountRoomsByStatus).then((response) => {
      if (response.data.status === 200) {
        setRoomsCount(response.data.roomsCount);
      }
    });
  }, []);

  return (
    <Fragment>
      <PieChart width={730} height={250}>
        <Pie
          data={roomsCount}
          dataKey="total"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#82ca9d"
          label
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
      </PieChart>
    </Fragment>
  );
}
