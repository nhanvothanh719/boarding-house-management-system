import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";

import { Pie, PieChart, Sector } from "recharts";

import AppUrl from "../../../RestAPI/AppUrl";

export default function BreachRate(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [breachesTotal, setBreachesTotal] = useState([]);
  const [refreshChart, setRefreshChart] = useState(false);
  const color = "#1C4E80";
  const chartTitle = "Breach rates";

  useEffect(() => {
    axios.get(AppUrl.GetTotalNumberBreachMade).then((response) => {
      if (response.data.status === 200) {
        setBreachesTotal(response.data.breachTotals);
      }
    });
    setRefreshChart(props.isDataChange);
    if (props.isDataChange) {
      setRefreshChart(false);
    }
  }, [props.isDataChange]);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`Total: ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  return (
    <Fragment>
      <div className="customChartContainer">
      <h3 className="customChartTitle">{chartTitle}</h3>
        <PieChart
          width={450}
          height={300}
          margin={{ top: 10, right: 100, left: 10, bottom: 5 }}
        >
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={breachesTotal}
            cx="70%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            fill={color}
            dataKey="breach_histories_count"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </div>
    </Fragment>
  );
}
