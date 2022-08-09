import React, { PureComponent } from "react";
import { Pie, PieChart, Sector } from "recharts";

export default function BreachDetails({ match }) {
  const breachId = match.params.breachID;
  return <div>Breach Details {breachId}</div>;
}
