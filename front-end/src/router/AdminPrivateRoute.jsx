import React, { useState, useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import MasterLayout from "../pages/Dashboard/MasterLayout";
import RestClient from "../RestAPI/RestClient";
import AppUrl from "../RestAPI/AppUrl";
import Loading from "../components/Loading";
import axios from "axios";
import swal from "sweetalert";

function AdminPrivateRoute({ ...rest }) {
  const history = useHistory();
  
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    RestClient.GetRequest(AppUrl.CheckAuthenticated).then((response) => {
      if (response.status === 200) {
        setAuthenticated(true);
        setLoading(false);
      }
    });
    return () => {
      setAuthenticated(false);
    };
  }, []);

  axios.interceptors.response.use(undefined, function axiosRetryInterceptors(error) {
    if(error.response.status === 401) {
      swal("Unauthenticated", error.response.data.message, "warning");
      history.push("/home");
    }
    return Promise.reject(error);
  });

  axios.interceptors.response.use(undefined, function axiosRetryInterceptors(error) {
    if(error.response.status === 403) { //Access denied
      swal("Forbidden", error.response.data.message, "warning");
      history.push("/error-403");
    }
    else if(error.response.status === 404) { //Page not found
      swal("404 Error", "URL/Page does not exist", "warning");
      history.push("/error-404");
    }
    return Promise.reject(error);
  });

  if(isLoading) {
    return <Loading />
  }

  return (
    <Route
      {...rest} //name, path,...
      component={({ props, location }) =>
        isAuthenticated ? (
          <MasterLayout {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    />
  );
}


export default AdminPrivateRoute;
