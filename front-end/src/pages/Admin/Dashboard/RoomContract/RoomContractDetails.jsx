import React, { Fragment, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import { Button } from "react-bootstrap";
import "../../../../assets/css/custom.css";
import "../../../../assets/css/Dashboard/contract.css";

export default function RoomContractDetails({ match }) {
  const history = useHistory();
  const roomContractId = match.params.roomContractID;
  const lessorName = "Vo Thanh Nhan";
  const lessorDateOfBirth = "06/03/2001";
  const lessorCardIdNumber = "1233338880";
  const lessorPhoneNumber = "0963109853";
  const boardingHouseAddress = "1101 Dien Bien Phu Street, Thanh Khe Dong Ward, Thanh Khe District, Da Nang";

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
              <div className="contractMainContent">
                <center
                  className="mainTitle text-center text-uppercase"
                  style={{ fontSize: "30px" }}
                >
                  Room contract
                </center>
                <h5 className="contractSectionTitle">
                  1. Representative of the lessor (Party A):
                </h5>
                <div className="contractContent">
                  <p>
                    Mr/Ms:{" "}
                    <span className="customContractInput">{lessorName} </span>
                  </p>
                  <p>
                    Date of birth:{" "}
                    <span className="customContractInput">
                      {lessorDateOfBirth}
                    </span>
                  </p>
                  <p>
                    ID number:{" "}
                    <span className="customContractInput">
                      {lessorCardIdNumber}
                    </span>
                  </p>
                  <p>
                    Phone number:{" "}
                    <span className="customContractInput">
                      {lessorPhoneNumber}
                    </span>
                  </p>
                </div>
                <h5 className="contractSectionTitle">
                  2. Representative of the room tenant (Party B):
                </h5>
                <div className="contractContent">
                  <p>
                    Mr/Ms:{" "}
                    <span className="customContractInput">
                      {details.renter.name}
                    </span>
                  </p>
                  <p>
                    Date of birth:{" "}
                    <span className="customContractInput">
                      {moment(details.renter.date_of_birth).format("DD/MM/YYYY")}
                    </span>
                  </p>
                  <p>
                    ID number:{" "}
                    <span className="customContractInput">
                      {details.renter.id_card_number}
                    </span>
                  </p>
                  <p>
                    Phone number:{" "}
                    <span className="customContractInput">
                      {details.renter.phone_number}
                    </span>
                  </p>
                  <p>
                    After discussing in the spirit of democracy and mutual
                    benefit, the following agreements were reached:
                  </p>
                  <p>
                    Party A agrees to rent out to Party B a room at the address:{" "}
                    <span className="customContractInput">{boardingHouseAddress}</span>
                    with a deposit of ${" "}
                    <span className="customContractInput">
                      {details.deposit_amount}
                    </span>
                  </p>
                  <p>
                    The contract is valid from{" "}
                    <span className="customContractInput">
                      {details.effective_from}
                    </span>{" "}
                    to{" "}
                    <span className="customContractInput">
                      {details.effective_until}
                    </span>
                    .
                  </p>
                </div>
                <h5 className="contractSectionTitle">
                  RESPONSIBILITY OF THE PARTIES
                </h5>
                <div className="contractContent">
                  <em className="contractSectionSubtitle">
                    * Responsibilities of Party A:
                  </em>
                  <p>
                    - Create all favourable conditions for Party B to perform
                    under the contract.
                  </p>
                  <p>- Provide electricity, water, wifi for Party B to use.</p>
                  <em className="contractSectionSubtitle">
                    * Responsibility of Party B:
                  </em>
                  <p>- Pay in full the amount according to the agreement.</p>
                  <p>
                    - Preserve the equipment and facilities of Party A initially
                    equipped (damage must be repaired, lost must be
                    compensated).
                  </p>
                  <p>
                    - Do not arbitrarily repair or renovate facilities without
                    the consent of Party A.
                  </p>
                  <p>
                    - Maintain cleanliness inside and outside the premises of
                    the inn.
                  </p>
                  <p>
                    - Party B must comply with all provisions of State laws and
                    local regulations.
                  </p>
                  <p>
                    - In the case that Party B allows guests to stay overnight,
                    it must notify and obtain the consent of the host and be
                    responsible for the guest's violations of the law during
                    their stay.
                  </p>
                </div>
                <h5 className="contractSectionTitle">
                  GENERAL RESPONSIBILITIES
                </h5>
                <div className="contractContent">
                  <p>
                    - Both parties must create conditions for each other to
                    perform the contract.
                  </p>
                  <p>
                    - During the valid contract period, if either party violates
                    the agreed terms, the other party has the right to
                    unilaterally terminate the contract; if such breach of
                    contract causes damage to the breached party, the breaching
                    party shall have to compensate for the damage.
                  </p>
                  <p>
                    - Either party wishing to terminate the contract before the
                    time limit must notify the other party at least 30 days in
                    advance and the two parties must reach agreement.
                  </p>
                  <p>- Party A must return the deposit to Party B.</p>
                  <p>
                    - Any party that violates the general terms shall be held
                    responsible before the law.
                  </p>
                  <p>
                    - The contract is made in 2 copies with the same legal
                    validity, each party keeps one copy.
                  </p>
                </div>

                <br />
                <div className="contractContent">
                  <div className="customContractSignature">
                    <div className="signatureItem">
                      <center>
                        <h5 className="contractSectionTitle" style={{ textDecoration: "underline"}}>
                          Representative of the lessor
                        </h5>
                      </center>
                      <center>
                        <img
                          src={`http://127.0.0.1:8000/${details.owner_signature}`}
                          alt=""
                          style={{
                            width: "270px",
                            height: "200px",
                            borderRadius: "15%",
                            paddingBottom: "30px",
                            paddingTop: "20px",
                          }}
                        />
                      </center>
                      <center>
                        <span className="customContractInput">
                          {lessorName}{" "}
                        </span>
                      </center>
                    </div>
                    <div className="signatureItem">
                      <center>
                        <h5 className="contractSectionTitle" style={{ textDecoration: "underline"}}>
                          Representative of the renter
                        </h5>
                      </center>
                      <center>
                        <img
                          src={`http://127.0.0.1:8000/${details.renter_signature}`}
                          alt=""
                          style={{
                            width: "270px",
                            height: "200px",
                            borderRadius: "15%",
                            paddingBottom: "30px",
                            paddingTop: "20px",
                          }}
                        />
                      </center>
                      <center>
                        <span className="customContractInput">
                          {details.renter.name}
                        </span>
                      </center>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
