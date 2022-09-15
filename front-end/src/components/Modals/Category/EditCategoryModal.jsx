import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import TextField from "@mui/material/TextField";

import AppUrl from "../../../RestAPI/AppUrl";

export default function EditCategoryModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("updateCategoryModal")
      );
      model.show();
      axios.get(AppUrl.EditCategory + props.categoryId).then((response) => {
        if (response.data.status === 200) {
          setInput(response.data.category);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.categoryId]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("updateCategoryModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setEditModalStatus(false);
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const updateCategory = (e) => {
    e.preventDefault();
    const category = {
      name: input.name,
      price: input.price,
      description: input.description,
    };
    axios
    .put(AppUrl.UpdateCategory + props.categoryId, category)
    .then((response) => {
      if (response.data.status === 200) {
        setErrors([]);
        swal("Success", response.data.message, "success");
        props.updateModalStatus(true);
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
        id="updateCategoryModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Edit category</h5>
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
              <form>
                <div>
                  <label className="customModalLabel">Category name:</label>
                  <TextField
                    label="Name"
                    name="name"
                    value={input.name}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">{errors.name}</small>

                <div>
                  <label className="customModalLabel">Price:</label>
                  <TextField
                    label="Price"
                    name="price"
                    value={input.price}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">{errors.price}</small>
                <div>
                  <label className="customModalLabel">Description:</label>
                  <TextField
                    label="Description"
                    name="description"
                    value={input.description}
                    onChange={handleInput}
                    fullWidth
                    required
                    multiline
                  />
                </div>
                <small className="text-danger customSmallError">{errors.description}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={updateCategory}
              >
                Update
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
