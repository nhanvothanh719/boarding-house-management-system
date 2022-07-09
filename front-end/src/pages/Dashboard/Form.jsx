import React, { Component, Fragment } from 'react';
import SideBar from '../../components/Dashboard/SideBar';
import TopBar from '../../components/Dashboard/TopBar';
import Form from '../../components/Form/Form';

class RenterDetails extends Component {
  render() {
    return (
      <Fragment>
        <div  className="home">
            <SideBar/>
            <div className="homeContainer">
                <TopBar/>
                <Form/>
            </div>
        </div>
      </Fragment>
    )
  }
}

export default RenterDetails