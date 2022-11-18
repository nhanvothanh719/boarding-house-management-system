import React, { useState, useEffect } from "react";
import { Redirect, Route, useHistory } from "react-router-dom";

import axios from "axios";

import MasterLayout from "../layouts/Renter/MasterLayout";
import AppUrl from "../RestAPI/AppUrl";
import Loading from "../components/Loading/Loading";
import swal from "sweetalert";

export default function RenterPrivateRoute({ ...rest }) {
  const history = useHistory();

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.CheckRenterAuthorization).then((response) => {
      if (response.status === 200) {
        setAuthenticated(true);
      }
      setLoading(false); //Must have to set authenticated
    });
    return () => {
      setAuthenticated(false); //Cleanup
    };
  }, []);

  axios.interceptors.response.use(
    undefined, //undefined => 401 error
    function axiosRetryInterceptors(error) {
      if (error.response.status === 401) {
        swal("Unauthenticated", error.response.data.message, "warning");
        history.push("/");
      }
      return Promise.reject(error); //fail
    }
  );

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 403) {
        //access denied
        swal("Forbidden", error.response.data.message, "warning");
        history.push("/error-403");
      } else if (error.response.status === 404) {
        swal("404 Error", "URL/Page does not exist", "warning");
        history.push("/error-404");
      }
      return Promise.reject(error);
    }
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Route
      {...rest} //...rest --> name, path, ...
      render={({ props, location }) =>
        isAuthenticated ? (
          <MasterLayout {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        )
      }
    />
  );
}
