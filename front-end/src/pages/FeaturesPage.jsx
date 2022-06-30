import React, { Component, Fragment } from 'react';
import PageTitle from '../components/PageTitle';
import Features from "../components/Features";

class FeaturesPage extends Component {
  render() {
    return (
      <Fragment>
        <PageTitle title='Features page'/>
        <Features/>
      </Fragment>
    )
  }
}

export default FeaturesPage