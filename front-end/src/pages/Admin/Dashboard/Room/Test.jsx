import React, { Fragment, useEffect, useState  } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import "../../../../assets/css/Dashboard/room.css";
import AppUrl from "../../../../RestAPI/AppUrl";


export default function Test({ match }) {
    const history = useHistory();
  const roomId = match.params.roomID;

  const [input, setInput] = useState({
    number: "",
    description: "",
    category_id: "",
    area: "",
  });
  const [checkbox, setCheckbox] = useState([]);
  const [picture, setPicture] = useState("");
  const [oldImages, setOldImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.EditRoom + roomId).then((response) => {
      if (response.data.status === 200) {
        setInput(response.data.room);
        setCheckbox(response.data.room);
        setOldImages(response.data.images);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-services");
      }
      setLoading(false);
    });
  }, [roomId, history]);

  return (
    <Fragment>
      <div className="room">
        <div className="titleContainer">
          <h1 className="roomTitle">{roomId}</h1>
        </div>
        <div className="roomTop">
          <div className="roomTopLeft">
            <div className="leftContainer">
              <div className="roomInfoTop">
                <span className="roomName">Room Details</span>
              </div>
              <div className="roomInfoBottom">
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Room number:</span>
                  <span className="roomInfoValue">123</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Category:</span>
                  <span className="roomInfoValue">5123</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Description:</span>
                  <span className="roomInfoValue"></span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Area:</span>
                  <span className="roomInfoValue"></span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Conditioner:</span>
                  <span className="roomInfoValue"></span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Fridge:</span>
                  <span className="roomInfoValue"></span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Area:</span>
                  <span className="roomInfoValue"></span>
                </div>
                <div className="roomInfoTop">
                <span className="roomName">Renters in room</span>
              </div>
                <img
                  src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="renterInRoomImg"
                />
                <img
                  src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="renterInRoomImg"
                />
                <img
                  src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="renterInRoomImg"
                />
              </div>
              
            </div>
          </div>
          <div className="roomTopRight">
            <div className="roomFormLeft">
              <label>Product Name</label>
              <input type="text" placeholder="Apple AirPod" />
              <label>In Stock</label>
              <select name="inStock" id="idStock">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <label>Active</label>
              <select name="active" id="active">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <button className="roomButton">Update</button>
            </div>
          </div>
        </div>
        <div className="roomBottom">
          <form className="roomForm">
            <div className="roomFormRight">
              <div className="roomUpload">
                <img
                  src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="roomUploadImg"
                />
                <img
                  src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="roomUploadImg"
                />
                <img
                  src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="roomUploadImg"
                />
                <img
                  src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="roomUploadImg"
                />
                <img
                  src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                  className="roomUploadImg"
                />

                <label for="file">{/* <Publish/> */}</label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
