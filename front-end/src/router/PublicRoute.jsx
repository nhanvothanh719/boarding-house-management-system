import React from "react";
import { Route } from "react-router-dom";

import UserLayout from "../layouts/User/UserLayout";

export default function PublicRoute({ ...rest }) {
  return (
    <Route {...rest} render={(props) => <UserLayout {...props} /> } />
  );
}
