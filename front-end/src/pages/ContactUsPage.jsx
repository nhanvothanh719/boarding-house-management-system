import React, { Component, Fragment } from 'react';
import PageTitle from '../components/PageTitle';
import ContactUs from "../components/ContactUs";

class ContactUsPage extends Component {
  render() {
    return (
        <Fragment>
        <PageTitle title='Contact us page'/>
        <ContactUs/>
      </Fragment>
    )
  }
}

export default ContactUsPage