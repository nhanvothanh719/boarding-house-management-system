import React, { Fragment, useEffect } from "react";

import PageTitle from "../../components/User/PageTitle";
import AvailableRooms from "../../components/User/AvailableRooms";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";


function AvailableRoomsPage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <Fragment>
      <WebPageTitle pageTitle="Available rooms" />
      <PageTitle title="Rooms for rent" />
      <AvailableRooms />
    </Fragment>
  );
}

export default AvailableRoomsPage;
