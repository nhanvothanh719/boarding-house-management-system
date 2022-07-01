import React, { Component, Fragment } from 'react';
import PageTitle from "../components/PageTitle";
import AvailableRooms from '../components/AvailableRooms';

class AvailableRoomsPage extends Component {
  render() {
    return (
        <Fragment>
        <PageTitle title='Rooms for rent'/>
        <AvailableRooms/>
      </Fragment>
    )
  }
}

export default AvailableRoomsPage