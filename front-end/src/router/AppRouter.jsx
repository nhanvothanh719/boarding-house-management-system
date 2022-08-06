import React from "react";
import { Switch, Route } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";
import Error_403 from "../pages/Error/Error_403";
import Error_404 from "../pages/Error/Error_404";

function AppRouter() {
  return (
    <div>
      <Switch>
        {/* Private routes for admin */}
        <AdminPrivateRoute path="/admin" name="Admin" />
        {/* Errors */}
        <Route exact path="/error-403" component={Error_403} />
        <Route exact path="/error-404" component={Error_404} />

        {/* Public routes for all users --> must be put below */}
        <PublicRoute path="/" name="Home" />        
      </Switch>
    </div>
  );
}

export default AppRouter;
