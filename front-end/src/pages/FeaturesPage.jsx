import React, { Component, Fragment } from 'react';
import PageTitle from '../components/PageTitle';
import Features from "../components/Features";
import WebPageTitle from "../components/WebPageTitle";
import Footer from '../common/Footer';

class FeaturesPage extends Component {
  componentDidMount(){
    window.scroll(0, 0)
  }
  render() {
    return (
      <Fragment>
        <WebPageTitle pageTitle="Features" />
        <PageTitle title='Features page'/>
        <Features/>
        <Footer/>
      </Fragment>
    )
  }
}

export default FeaturesPage