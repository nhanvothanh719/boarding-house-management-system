import React, { Component, Fragment } from 'react';
import PageTitle from '../components/PageTitle';
import WhyChooseUs from "../components/WhyChooseUs";

class WhyChooseUsPage extends Component {
  render() {
    return (
        <Fragment>
        <PageTitle title='Why Choose Us page'/>
        <WhyChooseUs/>
      </Fragment>
    )
  }
}

export default WhyChooseUsPage