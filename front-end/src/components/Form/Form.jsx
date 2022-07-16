import React, { Fragment } from "react";
import "../../assets/css/Dashboard/form.css";
import Avatar from "../../assets/images/avatar.jpeg";
import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined";

function Form() {
  return (
    <Fragment>
      <div className="topContainer">
        <h1>Add new renter</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomLeftContainer">
          <img src={Avatar} className="userImg" alt=""/>
        </div>
        <div className="bottomRightContainer">
          <form className="flexForm">
            <div className="formInput">
              <label className="inputItemLabel">Full name:</label>
              <input
                type="text"
                placeholder="Nguyen Van A"
                className="inputItem"
              />
            </div>
            <div className="formInput">
              <label className="inputItemLabel">Email:</label>
              <input
                type="email"
                placeholder="admin@gmail.com"
                className="inputItem"
              />
            </div>
            <div className="formInput">
              <label className="inputItemLabel">ID Card:</label>
              <input type="text" placeholder="23232323" className="inputItem" />
            </div>
            <div className="formInput">
              <label className="inputItemLabel">Phone number:</label>
              <input
                type="text"
                placeholder="0960000001"
                className="inputItem"
              />
            </div>
            <div className="formInput">
              <label className="inputItemLabel">Permanent address:</label>
              <input
                type="text"
                placeholder="Elton St. 216 NewYork"
                className="inputItem"
              />
            </div>
            <div className="formInput">
              <label htmlFor="file" className="inputItemLabel">
                Image:
                <FilePresentOutlinedIcon className="uploadFileIcon" />
              </label>
              <input type="file" id="file" style={{ display: "none" }} />
            </div>
            <button className="formButton">Send email</button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default Form;
