import React from "react";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";
import Error_403 from "../pages/Error/Error_403";
import Error_404 from "../pages/Error/Error_404";
import LoginPage from "../pages/Auth/LoginPage";
import ForgetPassword from "../pages/Auth/ForgetPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import axios from "axios";
import swal from "sweetalert";

function AppRouter() {
//   const history = useHistory();
//   axios.interceptors.response.use(
//     function (response) {
//       return response;
//     },
//     function (error) {
// if (error.response.status === 404) {
//         swal("404 Error", "URL/Page does not exist", "warning");
//         history.push("/error-404");
//       }
//       return Promise.reject(error);
//     });

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
