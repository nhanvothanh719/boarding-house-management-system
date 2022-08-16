import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function EditMotorbike({ match }) {
  const history = useHistory();
  const motorbikeId = match.params.motorbikeID;
  
  const [errors, setErrors] = useState([]);
  const [motorbikeImage, setMotorbikeImage] = useState([]);
  const [input, setInput] = useState({
    renter_id: "",
    license_plate: "",
  });
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.EditMotorbike + motorbikeId).then((response) => {
      if (response.data.status === 200) {
        setInput(response.data.motorbike);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-motorbikes");
      }
      setLoading(false);
    });
  }, [motorbikeId, history]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleMotorbikeImage = (e) => {
    setMotorbikeImage({ motorbike_image: e.target.files[0] });
  };

  const updateMotorbike = (e) => {
    e.preventDefault();
    const motorbike = new FormData();
    motorbike.append("renter_id", input.renter_id);
    motorbike.append("license_plate", input.license_plate);
    if (motorbikeImage.motorbike_image) {
      motorbike.append("motorbike_image", motorbikeImage.motorbike_image);
    }

    axios
      .post(AppUrl.UpdateMotorbike + motorbikeId, motorbike)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          history.push("/admin/view-all-motorbikes");
        } else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        } else if (response.data.status === 404) {
          if(response.data.message) {
            swal("No user found", response.data.message, "error");
          }
          setInput({ ...input, errors_list: response.data.errors });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const findUser = (e) => {
    e.preventDefault();
    if (input.renter_id) {
      axios
        .get(AppUrl.FindName + input.renter_id)
        .then((response) => {
          if (response.data.status === 200) {
            swal("User found", response.data.name, "success");
          } else if (response.data.status === 404) {
            swal("No user found", response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  if(loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <div className="topContainer">
        <h1>Add new renter</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          <form
            encType="multipart/form-data"
            className="flexForm"
            onSubmit={updateMotorbike}
          >
            <div className="formInput">
              <label>Motorbike license plate:</label>
              <input
                type="text"
                className="inputItem"
                name="license_plate"
                onChange={handleInput}
                value={input.license_plate}
              />
            </div>
            <div className="formInput">
              <label>Owner:</label>
              <input
                type="text"
                className="inputItem"
                name="renter_id"
                onChange={handleInput}
                value={input.renter_id}
              />
            </div>
            <small className="text-danger">{errors.renter_id}</small>
            <button onClick={findUser}>Find person</button>
            <div className="formInput form-group">
              <label>Motorbike image:</label>
              <input
                type="file"
                className="form-control"
                name="motorbike_image"
                onChange={handleMotorbikeImage}
              />
            </div>
            <small className="text-danger">{errors.motorbike_image}</small>
            <img src={`http://127.0.0.1:8000/${input.motorbike_image}`} alt= "" style={{width: "60px", height: "60px", borderRadius: "50%"}}/>
            <button type="submit" className="formButton">
              Update
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
