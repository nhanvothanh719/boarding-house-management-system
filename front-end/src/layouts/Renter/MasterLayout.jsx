import React, { Fragment } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import routes from "../../router/RenterRoutes";
import SideBar from "./SideBar";
import TopBar from "./TopBar";


function MasterLayout() {
  return (
    <Fragment>
      <div className="home">
        <SideBar />
        <div className="homeContainer">
          <TopBar />
          <Switch>
            {routes.map((route, index) => {
              return(
                route.component && (
                  <Route
                    key={index}
                    path={route.path}
                    name={route.name}
                    exact={route.exact}
                    render={(props) => <route.component {...props} />}
                  />
                )
              );
            })}
            <Redirect from="/renter" to="/renter/view-room-details" />
          </Switch>
        </div>
      </div>
    </Fragment>
  );
}

export default MasterLayout;