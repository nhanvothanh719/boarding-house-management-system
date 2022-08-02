import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import AppRouter from "./router/AppRouter";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import MessengerCustomerChat from "react-messenger-customer-chat";

function App() {
  return (
    <Router>
      <AppRouter />
      <TawkMessengerReact
        propertyId="62e95dc037898912e960e203"
        widgetId="1g9fpce2n"
      />
      <MessengerCustomerChat
        pageId="104103952405175"
        appId="1160238107906300"
      />
    </Router>
  );
}

export default App;
