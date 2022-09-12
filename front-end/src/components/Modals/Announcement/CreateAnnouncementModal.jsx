import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";
import { TextField } from "@mui/material";

export default function CreateAnnouncementModal(props) {
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("sendAnnouncementModal")
      );
      model.show();
    }
  }, [props.isShown]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("sendAnnouncementModal")
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

  const sendAnnouncement = (e) => {
    e.preventDefault();
    props.setLoaderClass('');
    props.setDisplayComponentsClass('d-none');
    const data = {
      all_id: props.rentersIdList,
      title: input.title,
      content: input.content,
    };
    axios
      .post(AppUrl.SendAnnouncement, data)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          setInput({
            title: "",
            content: "",
          });
          swal("Success", response.data.message, "success");
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            displayModal();
          }, 1000);
        }
        props.setLoaderClass('d-none');
        props.setDisplayComponentsClass('');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Fragment>
      <form
        class="modal fade"
        id="sendAnnouncementModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle" id="exampleModalLabel">
                Send announcement
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={closeModal}>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form className="flexForm">
                <div>
                <label className="customModalLabel">Title:</label>
          <TextField
                    label="Title"
                    name="title"
                    value={input.title}
                    onChange={handleInput}
                    fullWidth
                    required
                  />
                </div>
                <small className="text-danger customSmallError">{errors.title}</small>
                <div>
                <label className="customModalLabel">Content:</label>
                <TextField
                    label="Content"
                    name="content"
                    value={input.content}
                    onChange={handleInput}
                    fullWidth
                    multiline
                    required
                  />
                </div>
                <small className="text-danger customSmallError">{errors.content}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={sendAnnouncement}
              >
                Create
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
      </form>
    </Fragment>
  )
}
