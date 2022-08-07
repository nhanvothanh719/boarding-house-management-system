import React from "react";
import { Redirect } from "react-router-dom";

function UserProfile(props) {
  let name;
  let email;
  if (props.user) {
    name = props.user.name;
    email = props.user.email;
  }
  //Protect URL
  if (!localStorage.getItem("token")) {
    return <Redirect to={"login"} />;
  }
  return (
    <div class="row">
      <div class="jumbotron col-lg-4 offset-lg-4">
        <h3 class="text-center">User Profile</h3>
        <ul class="list-group">
          <li class="list-group-item">Name: {name}</li>
          <li class="list-group-item">Email: {email}</li>
        </ul>
      </div>
    </div>
  );
}

export default UserProfile;
