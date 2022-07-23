import React, { Fragment, useState } from "react";
import AppUrl from "../../../RestAPI/AppUrl";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";

function CreateCategory() {
  const history = useHistory();
  const [input, setInput] = useState({
    name: "",
    price: "",
    description: "",
    errors_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const formSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: input.name,
      price: input.price,
      description: input.description,
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
          history.push("/admin/view-all-categories");

        } else if (response.data.status === 400) {
          setInput({ ...input, errors_list: response.data.errors });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  var all_errors = [];
  if (input.errors_list) {
    all_errors = [
      input.errors_list.name,
      input.errors_list.price,
      input.errors_list.description,
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
            onSubmit={formSubmit}
            id="createCategoryForm"
          >
            <div className="formInput">
              <label className="inputItemLabel">Category name:</label>
              <input
                type="text"
                className="inputItem"
                name="name"
                onChange={handleInput}
                value={input.name}
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
                onChange={handleInput}
                value={input.price}
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
                onChange={handleInput}
                value={input.description}
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

export default CreateCategory;
