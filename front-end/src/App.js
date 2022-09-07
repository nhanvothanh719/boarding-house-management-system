import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";

import ReactDOM from "react-dom";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import MessengerCustomerChat from "react-messenger-customer-chat";
import axios from "axios";
import PublicRoute from "./router/PublicRoute";
import AdminPrivateRoute from "./router/AdminPrivateRoute";
import RenterPrivateRoute from "./router/RenterPrivateRoute";
import Error_403 from "./pages/Error/Error_403";
import Error_404 from "./pages/Error/Error_404";
import LoginPage from "./pages/Auth/LoginPage";
import ForgetPassword from "./pages/Auth/ForgetPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";


  //Set Bearer token to prevent 401 error when logout
  axios.interceptors.request.use(function (config){
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

function App() {

  return (
    <Router>
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
      <TawkMessengerReact
        propertyId="62e95dc037898912e960e203"
        widgetId="1g9fpce2n"
      />
      {/* <MessengerCustomerChat
        pageId="104103952405175"
        appId="1160238107906300"
      /> */}
    </Router>
  );
}

export default App;
