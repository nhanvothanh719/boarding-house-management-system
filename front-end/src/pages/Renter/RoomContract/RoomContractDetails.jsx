import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";
import RoomContract from "../../../components/Template/RoomContract";
export default function RoomContractDetails() {
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({});
  
    useEffect(() => {
      axios
        .get(AppUrl.GetRenterRoomContract)
        .then((response) => {
          if (response.data.status === 200) {
            setDetails(response.data.roomContract);
            setLoading(false);
          } else if (response.data.status === 404) {
            swal("Error", response.data.message, "error");
          }
        });
    }, []);
  
    if (loading) {
      return <Loading />;
    }
    return (
      <RoomContract roomContract={details}/>
    );
}
