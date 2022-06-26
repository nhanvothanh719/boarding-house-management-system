import React, { Component } from "react";

class UserProfile extends Component {
  render() {
    return (
      <div class="row">
        <div class="jumbotron col-lg-4 offset-lg-4">
          <h3 class="text-center">User Profile</h3>
          <ul class="list-group">
            <li class="list-group-item">Name: </li>
            <li class="list-group-item">Email:</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default UserProfile;
