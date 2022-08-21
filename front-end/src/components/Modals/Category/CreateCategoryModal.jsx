import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

export default function CreateCategoryModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("createCategoryModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("createCategoryModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setCreateModalStatus(false);
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const createCategory = (e) => {
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
          setErrors([]);
          swal("Success", response.data.message, "success");
          props.updateCreateModalStatus(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            displayModal();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <div
        class="modal fade"
        id="createCategoryModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create new category</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={closeModal}>
                  &times;
                </span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form className="flexForm">
                <div className="form-group">
                  <label className="inputItemLabel">Category name:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="name"
                    onChange={handleInput}
                    value={input.name}
                  />
                </div>
                <small className="text-danger">{errors.name}</small>

                <div className="form-group">
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
                <small className="text-danger">{errors.price}</small>
                <div className="form-group">
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
                <small className="text-danger">{errors.description}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={createCategory}
              >
                Send
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
