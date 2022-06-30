import React, { Component, Fragment } from 'react';
import PageTitle from '../components/PageTitle';
import PrivacyPolicy from '../components/PrivacyPolicy';

class PrivacyPolicyPage extends Component {
  render() {
    return (
        <Fragment>
        <PageTitle title='Privacy Policy'/>
        <PrivacyPolicy />
  </Fragment>
    )
  }
}

export default PrivacyPolicyPage