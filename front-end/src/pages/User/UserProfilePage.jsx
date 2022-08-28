import React, { Fragment, useEffect } from "react";

import PageTitle from "../../components/User/PageTitle";
import EditProfile from "../../components/User/EditProfile";
import WebPageTitle from "../../components/WebPageTitle/WebPageTitle";

function UserProfilePage() {

  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  
  return (
    <Fragment>
      <WebPageTitle pageTitle="User profile" />
      <PageTitle title="Edit user profile" />
      <EditProfile />
    </Fragment>
  );
}

export default UserProfilePage;
