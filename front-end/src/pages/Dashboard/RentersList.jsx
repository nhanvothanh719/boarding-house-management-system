import React, { Component, Fragment } from 'react';
import SideBar from '../../components/Dashboard/SideBar';
import TopBar from '../../components/Dashboard/TopBar';
import "../../assets/css/Dashboard/datatable.css";
import Datatable from '../../components/Dashboard/Datatable/Datatable';

export class RentersList extends Component {
  render() {
    return (
      <Fragment>
        <div className="customList">
            <SideBar/>
            <div className="listContainer">
                <TopBar/>
                <Datatable/>
            </div>
        </div>
      </Fragment>
    )
  }
}

export default RentersList