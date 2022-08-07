import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

function EditCategory({ match }) {
  const history = useHistory();
  const categoryId = match.params.categoryID;

  const [loading, setLoading] = useState(true);
  const [categoryInput, setCategory] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.EditCategory + categoryId).then((response) => {
      if (response.data.status === 200) {
        setCategory(response.data.category);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push('/admin/view-all-categories');
      }
      setLoading(false);
    });
  }, [categoryId, history]);

  const handleInput = (e) => {
    e.persist();
    setCategory({ ...categoryInput, [e.target.name]: e.target.value });
  };

  const updateCategory = (e) => {
    e.preventDefault();
    const data = categoryInput;
    axios.put(AppUrl.UpdateCategory + categoryId, data).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        setErrors([]);
      } else if (response.data.status === 422) {
        swal("Inappropriate values", "", "error");
        setErrors(response.data.errors);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-categories");
      }
    });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <div className="topContainer">
        <Link to="/admin/view-all-categories/"> Back </Link>
        <h1>Edit category</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          <form
            className="flexForm"
            onSubmit={updateCategory}
            id="createCategoryForm"
          >
            <div className="formInput">
              <label className="inputItemLabel">Category name:</label>
              <input
                type="text"
                className="inputItem"
                name="name"
                onChange={handleInput}
                value={categoryInput.name}
                id="inputName"
              />
              <small>{errors.name}</small>
            </div>
            <div className="formInput">
              <label className="inputItemLabel">Price:</label>
              <input
                type="text"
                className="inputItem"
                name="price"
                onChange={handleInput}
                value={categoryInput.price}
                id="inputPrice"
              />
              <small>{errors.price}</small>
            </div>
            <div className="formInput">
              <label className="inputItemLabel">Description:</label>
              <textarea
                type="text"
                className="inputItem"
                name="description"
                onChange={handleInput}
                value={categoryInput.description}
                id="inputDescription"
              />
              <small>{errors.description}</small>
            </div>
            <button type="submit" className="formButton">
              Update
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default EditCategory;
