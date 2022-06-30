import React, { Component, Fragment } from 'react';
import { Container } from 'react-bootstrap';
import PageTitle from '../components/PageTitle';
import TermsAndCondition from '../components/TermsAndCondition';

class TermsAndConditionPage extends Component {
  render() {
    return (
      <Fragment>
            <PageTitle title='All terms and condition'/>
            <TermsAndCondition />
      </Fragment>
    )
  }
}

export default TermsAndConditionPage