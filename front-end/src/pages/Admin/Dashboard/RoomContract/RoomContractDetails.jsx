import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import { Button } from "react-bootstrap";
import "../../../../assets/css/custom.css";

export default function RoomContractDetails({ match }) {
  const history = useHistory();
  const roomContractId = match.params.roomContractID;
  const lessorName = "Vo Thanh Nhan";
  const lessorDateOfBirth = "06/03/2001";
  const lessorCardIdNumber = "";
  const lessorPhoneNumber = "";

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
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={handlePrint}
          >
            Print room contract
          </Button>
        </div>
        <div ref={componentRef}>
          <div className="roomBottom">
            <div className="roomFormRight">
              <center className="mainTitle text-center text-uppercase">Room contract</center>
              <h5>1. Representative of the lessor (Party A):</h5>
              <p>Mr/Ms: {lessorName}  Date of birth: {lessorDateOfBirth}</p>
              <p>ID number: {lessorCardIdNumber}</p>
              <p>Phone number: {lessorPhoneNumber}</p>
              <h5>2. Representative of the room tenant (Party B):</h5>
              <p>Mr/Ms: {details.renter.name} Date of birth: {details.renter.date_of_birth}</p>
              <p>ID number: {details.renter.id_card_number}</p>
              <p>Phone number: {details.renter.phone_number}</p>
              <p>After discussing in the spirit of democracy and mutual benefit, the following agreements were reached:</p>
              <p>Party A agrees to rent out to Party B a room at the address: … with a deposit of $ {details.deposit_amount}</p>
              <p>The contract is valid from {details.effective_from} to {details.effective_until}.</p>
              <h5>RESPONSIBILITY OF THE PARTIES</h5>
              <em>* Responsibilities of Party A:</em>
              <p>- Create all favourable conditions for Party B to perform under the contract.</p>
              <p>- Provide electricity, water, wifi for Party B to use.</p>
              <em>* Responsibility of Party B:</em>
              <p>- Pay in full the amount according to the agreement.</p>
              <p>- Preserve the equipment and facilities of Party A initially equipped (damage must be repaired, lost must be compensated).</p>
              <p>- Do not arbitrarily repair or renovate facilities without the consent of Party A.</p>
              <p>- Maintain cleanliness inside and outside the premises of the inn.</p>
              <p>- Party B must comply with all provisions of State laws and local regulations.</p>
              <p>- In the case that Party B allows guests to stay overnight, it must notify and obtain the consent of the host and be responsible for the guest's violations of the law during their stay.</p>
              <h5>GENERAL RESPONSIBILITIES</h5>
              <p>- Both parties must create conditions for each other to perform the contract.</p>
              <p>- During the valid contract period, if either party violates the agreed terms, the other party has the right to unilaterally terminate the contract; if such breach of contract causes damage to the breached party, the breaching party shall have to compensate for the damage.</p>
              <p>- Either party wishing to terminate the contract before the time limit must notify the other party at least 30 days in advance and the two parties must reach agreement.</p>
              <p>- Party A must return the deposit to Party B.</p>
              <p>- Any party that violates the general terms shall be held responsible before the law.</p>
              <p>- The contract is made in 2 copies with the same legal validity, each party keeps one copy.</p>
              <br/>


              {/* <p>{details.renter_id}</p>
              <p>{details.effective_from}</p>
              <p>{details.effective_until}</p>
              <p>{details.deposit_amount}</p> */}
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
          </div>
        </div>
      </div>
    </Fragment>
  );
}
