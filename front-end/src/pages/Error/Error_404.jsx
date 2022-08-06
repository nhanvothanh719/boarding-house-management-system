import React, { Fragment, useState } from "react";

import Error from "../../components/Error/Error";

function Error_404() {
  const [errorMessageTitle] = useState("Page Not Found");
  const [errorMessageText] = useState(
    "We're sorry, the page you were looking for isn't found here. The link you followed may either be broken or no longer exists. Please try again, or take a look at our."
  );
  const [errorCode] = useState("404");

  return (
    <Fragment>
      <Error
        errorMessageTitle={errorMessageTitle}
        errorMessageText={errorMessageText}
        errorCode={errorCode}
      />
    </Fragment>
  );
}

export default Error_404;
