import React, { Component } from "react";
import Features from "./HomePage/Features";
import TopBanner from "./HomePage/TopBanner";

export class Home extends Component {
  render() {
    return (
      <div>
        <TopBanner />
        <Features />
      </div>
    );
  }
}

export default Home;
