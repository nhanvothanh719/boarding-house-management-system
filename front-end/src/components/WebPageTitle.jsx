import React, { Component } from "react";

export class WebPageTitle extends Component {
  constructor(props) {
    super();
    this.state = {
      webPageTitle: props.pageTitle,
    };
  }
  render() {
    return <title>{ this.state.webPageTitle }</title>;
  }
}

export default WebPageTitle;
