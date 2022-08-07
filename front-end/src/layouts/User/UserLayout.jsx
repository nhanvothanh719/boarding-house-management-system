import React, { Fragment } from 'react'
import { Redirect, Route, Switch } from "react-router-dom";

import routes from "../../router/PublicRoutes";
import Footer from './Footer';
import NavBar from './NavBar';

export default function UserLayout() {
  return (
    <Fragment>
      <NavBar/>
          <Switch>
            {
            routes.map((route, index) => {
              return (
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
            <Redirect from="/home" to="/" />
          </Switch>
          <Footer/>
    </Fragment>
  )
}
