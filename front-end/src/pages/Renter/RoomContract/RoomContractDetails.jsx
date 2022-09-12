import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";
import RoomContract from "../../../components/Template/RoomContract";
import WebPageTitle from "../../../components/WebPageTitle/WebPageTitle";
import Error from "../Error/Error";

export default function RoomContractDetails() {
  const errorMessage =
    "Oops. Your room contract has not been created. Please contact with the admin.";

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [errorDisplay, setErrorDisplay] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.GetRenterRoomContract).then((response) => {
      if (response.data.status === 200) {
        setDetails(response.data.roomContract);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        setErrorDisplay(true);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  } else if (errorDisplay) {
    return (
      <Fragment>
        <Error errorMessage={errorMessage} />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Room contract details" />
        {/* <RoomContract roomContract={details} /> */}
        <Error errorMessage={errorMessage} />
      </Fragment>
    );
  }
}
