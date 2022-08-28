import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";
import Error_403 from "../pages/Error/Error_403";
import Error_404 from "../pages/Error/Error_404";
import LoginPage from "../pages/Auth/LoginPage";
import ForgetPassword from "../pages/Auth/ForgetPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import RenterPrivateRoute from "./RenterPrivateRoute";

function AppRouter() {
  return (
    <div>
      <Switch>
        {/* Login, change password ---> Redirect to Homepage when entering below URLs if login */}
        <Route path="/login">
          {localStorage.getItem('auth_token') ? <Redirect to="/" /> : <LoginPage/>}
        </Route>
        <Route path="/forget-password">
          {localStorage.getItem('auth_token') ? <Redirect to="/" /> : <ForgetPassword/>}
        </Route>
        <Route path="/reset-password/:token">
          {localStorage.getItem('auth_token') ? <Redirect to="/" /> : <ResetPasswordPage/>}
        </Route>
        {/* Private routes for renter */}
        <RenterPrivateRoute  path="/renter" name="Renter" />
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
