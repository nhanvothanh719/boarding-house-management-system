import React, { Fragment, useState } from "react";
import AppUrl from "../../../RestAPI/AppUrl";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";

export default function CreateService() {
  const history = useHistory();
  const [input, setInput] = useState({
    name: "",
    description: "",
    unit: "",
    unit_price: "",
    is_compulsory: "",
    errors_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const createService = (e) => {
    e.preventDefault();
    const data = {
      name: input.name,
      description: input.description,
      unit: input.unit,
      unit_price: input.unit_price,
      is_compulsory: input.is_compulsory,
    };
    axios
      .post(AppUrl.StoreService, data)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          history.push("/admin/view-all-services");
        } else if (response.data.status === 400) {
          setInput({ ...input, errors_list: response.data.errors });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <div className="topContainer">
        <h1>Add new service</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          <form
            className="flexForm"
            onSubmit={createService}
          >
            <div className="formInput">
              <label className="inputItemLabel">Service name:</label>
              <input
                type="text"
                className="inputItem"
                name="name"
                onChange={handleInput}
                value={input.name}
              />
            </div>
            <span>{input.errors_list.name}</span>
            <div className="formInput">
              <label className="inputItemLabel">Description:</label>
              <textarea
                type="text"
                className="inputItem"
                name="description"
                onChange={handleInput}
                value={input.description}
              />
            </div>
            <div className="formInput">
              <label className="inputItemLabel">Unit:</label>
              <input
                type="text"
                className="inputItem"
                name="unit"
                onChange={handleInput}
                value={input.unit}
              />
            </div>
            <span>{input.errors_list.unit}</span>
            <div className="formInput">
              <label className="inputItemLabel">Cost per unit:</label>
              <input
                type="text"
                className="inputItem"
                name="unit_price"
                onChange={handleInput}
                value={input.unit_price}
              />
            </div>
            <span>{input.errors_list.unit_price}</span>
            <div className="formInput">
              <label>Compulsory:</label>
              <input
                type="checkbox"
                className="inputItem"
                name="is_compulsory"
                onChange={handleInput}
                defaultChecked={input.is_compulsory === 1 ? true : false}
              />
            </div>
            <span>{input.errors_list.is_compulsory}</span>
            <button type="submit" className="formButton">
              Create
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
