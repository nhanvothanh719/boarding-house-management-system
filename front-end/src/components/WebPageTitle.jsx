import React, { useState } from "react";

function WebPageTitle(props) {
  const [webPageTitle] = useState(props.pageTitle);
  return <title>{webPageTitle}</title>;
}

export default WebPageTitle;
