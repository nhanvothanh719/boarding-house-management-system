import React, { Fragment } from "react";
import routes from "../../router/AdminRoutes";
import SideBar from "../../components/Dashboard/SideBar";
import TopBar from "../../components/Dashboard/TopBar";
import "../../assets/css/Dashboard/common.css";
import { Redirect, Route, Switch } from "react-router-dom";

function MasterLayout() {
  return (
    <Fragment>
      <div className="home">
        <SideBar />
        <div className="homeContainer">
          <TopBar />
          <Switch>
            {routes.map((route, index) => {
              return (
                route.component && (
                  <Route
                    key={index}
                    path={route.path}
                    name={route.name}
                    exact={route.exact}
                    component={(props) => <route.component {...props} />}
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
