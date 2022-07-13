import React, { Component, Fragment, useState } from "react";
import "../../assets/css/Dashboard/form.css";
import AppUrl from "../../RestAPI/AppUrl";
import swal from "sweetalert";
import axios from "axios";

export class CreateCategory extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      price: "",
      description: "",
      errors_list: [],
    };
  }

  handleInput = (e) => {
    e.persist();
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: this.state.name,
      price: this.state.price,
      description: this.state.description,
    };
    axios
      .post(AppUrl.StoreCategory, data)
      .then((response) => {
        if (response.data.status === 200) {
          //Delete input after submit the form
          document.getElementById("inputName").value = "";
          document.getElementById("inputPrice").value = "";
          document.getElementById("inputDescription").value = "";
          swal("Success", response.data.message, "success");
        } else if (response.data.status === 400) {
          this.setState({ ...this.state, errors_list: response.data.errors });
          console.log(this.state.errors_list);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    var all_errors = [];
    if (this.state.errors_list) {
      all_errors = [
        this.state.errors_list.name,
        this.state.errors_list.price,
        this.state.errors_list.description,
      ];
    }
    return (
      <Fragment>
        <div className="topContainer">
          <h1>Add new category</h1>

          {all_errors.map((error) => {
            return <l>{error}</l>;
          })}
        </div>
        <div className="bottomContainer">
          <div className="bottomRightContainer">
            <form
              className="flexForm"
              onSubmit={this.formSubmit}
              id="createCategoryForm"
            >
              <div className="formInput">
                <label className="inputItemLabel">Category name:</label>
                <input
                  type="text"
                  className="inputItem"
                  name="name"
                  onChange={this.handleInput}
                  value={this.state.name}
                  id="inputName"
                />
              </div>
              {/* <span>{this.state.errors_list.name}</span> */}
              <div className="formInput">
                <label className="inputItemLabel">Price:</label>
                <input
                  type="text"
                  className="inputItem"
                  name="price"
                  onChange={this.handleInput}
                  value={this.state.price}
                  id="inputPrice"
                />
              </div>
              {/* <span>{this.state.errors_list.price}</span> */}
              <div className="formInput">
                <label className="inputItemLabel">Description:</label>
                <textarea
                  type="text"
                  className="inputItem"
                  name="description"
                  onChange={this.handleInput}
                  value={this.state.description}
                  id="inputDescription"
                />
              </div>
              {/* <span>{this.state.errors_list.description}</span> */}
              <button type="submit" className="formButton">
                Create
              </button>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CreateCategory;
