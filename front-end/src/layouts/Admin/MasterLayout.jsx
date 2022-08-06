import React, { Fragment } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import routes from "../../router/AdminRoutes";
import SideBar from "../Admin/SideBar";
import TopBar from "../Admin/TopBar";
import "../../assets/css/Dashboard/common.css";


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
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </div>
      </div>
    </Fragment>
  );
}

export default MasterLayout;
