import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import MasterLayout from "../pages/Dashboard/MasterLayout";
import RestClient from "../RestAPI/RestClient";
import AppUrl from "../RestAPI/AppUrl";
import Loading from "../components/Loading";
import axios from "axios"; 
import swal from "sweetalert";

class AdminPrivateRoute extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      loading: true,
    };
  }

  componentDidMount() {
    RestClient.GetRequest(AppUrl.CheckAuthenticated)
      .then((response) => {
        if (response.status === 200) {
        this.setState({ loading: false });
      }
    })
  }


  render() {
    //If user did not login --> undefined <=> 401
    axios.interceptors.response.use(undefined, function axiosRetryInterceptors(error) {
      if(error.response.status === 401) {
        swal("Unauthorized", error.response.data.message, "warning");
        <Redirect to="/home" />
      }
      return Promise.reject(error);
    });

    if(this.state.loading) {
      return <Loading />
    }

    return (
      <Route
      {...this.rest} //name, path,...
      component={ ({ props, location }) =>
      RestClient.GetRequest(AppUrl.CheckAuthenticated)
      .then((response) => (response.status === 200)) ? (
          <MasterLayout {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
      />
    );
  }
}

export default AdminPrivateRoute;
