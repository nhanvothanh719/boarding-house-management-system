import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import { Legend, Pie, PieChart, Tooltip, Cell } from "recharts";

import AppUrl from "../../../RestAPI/AppUrl";

export default function RoomStatusRate() {
  const [roomsCount, setRoomsCount] = useState([]);
  const colors = ["#EA6A47", "#1C4E80", "#7E909A"];
  const chartTitle = "Room status ratio";
  
  useEffect(() => {
    axios.get(AppUrl.CountRoomsByStatus).then((response) => {
      if (response.data.status === 200) {
        setRoomsCount(response.data.roomsCount);
      }
    });
  }, []);

  return (
    <Fragment>
      <div className="customChartContainer">
      <h3 className="customChartTitle">{chartTitle}</h3>
      <PieChart width={250} height={250}>
        <Pie
          data={roomsCount}
          dataKey="total"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          label
        >
          {roomsCount.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
      </PieChart>
      </div>
    </Fragment>
  );
}
