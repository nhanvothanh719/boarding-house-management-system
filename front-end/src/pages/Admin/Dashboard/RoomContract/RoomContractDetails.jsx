import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import * as ReactDOM from "react-dom";

import swal from "sweetalert";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

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

  //Handle print
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <div ref={componentRef}>
      <p>{details.renter_id}</p>
      <p>{details.effective_from}</p>
      <p>{details.effective_until}</p>
      <p>{details.deposit_amount}</p>
      <img
        src={`http://127.0.0.1:8000/${details.owner_signature}`}
        alt=""
        style={{ width: "60px", height: "60px", borderRadius: "50%" }}
      />
      <img
        src={`http://127.0.0.1:8000/${details.renter_signature}`}
        alt=""
        style={{ width: "60px", height: "60px", borderRadius: "50%" }}
      />
      </div>
      <button className="btn btn-primary" onClick={handlePrint}>
        Print room contract
      </button>
    </Fragment>
  );
}
