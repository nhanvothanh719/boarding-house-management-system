import React, { Fragment, useEffect, useState } from "react";

import PageTitle from "../../components/User/PageTitle";
import AvailableRoomDetails from "../../components/User/AvailableRoomDetails";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";

function AvailableRoomDetailsPage({ match }) {
  const [RoomPassedID] = useState(match.params.roomID); //Get from URL
  const [RoomPassedNumber] = useState(match.params.roomNumber); //Get from URL

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle="Room details" />
      <PageTitle title={"Room " + RoomPassedNumber + " details"} />
      <AvailableRoomDetails roomId={RoomPassedID} />
    </Fragment>
  );
}

export default AvailableRoomDetailsPage;
