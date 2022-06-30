import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import HomePage from "../pages/HomePage";
import FeaturesPage from "../pages/FeaturesPage";
import WhyChooseUsPage from "../pages/WhyChooseUsPage";
import ContactUsPage from "../pages/ContactUsPage";

class header extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/features" component={FeaturesPage} />
            <Route exact path="/why-choose-us" component={WhyChooseUsPage} />
            <Route exact path="/contact-us" component={ContactUsPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default header;