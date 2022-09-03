import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import RoomContract from "../../../../components/Template/RoomContract";

export default function RoomContractDetails({ match }) {
  const history = useHistory();
  const roomContractId = match.params.roomContractID;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});

  useEffect(() => {
    axios
      .get(AppUrl.GetRoomContractDetails + roomContractId)
      .then((response) => {
        if (response.data.status === 200) {
          setDetails(response.data.roomContractDetails);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
          history.push("/admin/view-all-room-contracts");
        }
        setLoading(false);
      });
  }, [roomContractId, history]);

  if (loading) {
    return <Loading />;
  }
  return (
    <RoomContract roomContract={details}/>
  );
}
