import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

export default function ReplyProblemModal(props) {
    const [errors, setErrors] = useState([]);
    const [replyText, setReplyText] = useState('');
    
    useEffect(() => {
        if (props.isShown === true) {
          var model = new window.bootstrap.Modal(
            document.getElementById("replyProblemModal")
          );
          model.show();
        }
      }, [props.isShown, props.problemId]);

      const displayModal = () => {
        var model = new window.bootstrap.Modal(
          document.getElementById("replyProblemModal")
        );
        model.show();
      };

      const closeModal = (e, value) => {
        props.setReplyModalStatus(false);
      };
    
      const submitReply = (e) => {
        e.preventDefault();
        props.setLoaderClass('');
    props.setDisplayComponentsClass('d-none');
        const text = {
            reply_text: replyText,
          };
        axios
          .put(AppUrl.ReplyProblem + props.problemId, text)
          .then((response) => {
            if (response.data.status === 200) {
              setErrors([]);
              setReplyText('');
              swal("Success", response.data.message, "success");
              props.updateProblemReplyStatus(true);
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
      };

  return (
    <Fragment>
        <div
        class="modal fade"
        id="replyProblemModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reply to renter's problem</h5>
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
                  <label className="customModalLabel">Reply text :</label>
                  <textarea
                    className="form-control"
                    name="reply_text"
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
                <small className="text-danger">{errors.reply_text}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={submitReply}
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
  )
}
