import React, { Component, Fragment } from 'react';
import SideBar from '../../components/Dashboard/SideBar';
import TopBar from '../../components/Dashboard/TopBar';
import { Container} from 'react-bootstrap';
import "../../assets/css/Dashboard/common.css";

export class Dashboard extends Component {
  render() {
    return (
      <Fragment>
        <div className="home">
        <SideBar/>
        <div className='homeContainer'>
          <TopBar/>
          Home container
        </div>
        </div>
      </Fragment>
    )
  }
}

export default Dashboard