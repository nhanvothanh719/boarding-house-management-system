import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";

import AppUrl from "../../../RestAPI/AppUrl";

export default function ViewReplyProblemModal(props) {
  const [details, setDetails] = useState({});

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("problemReplyModal")
      );
      model.show();
    }
    axios.get(AppUrl.GetProblemDetails + props.problemId).then((response) => {
        if (response.data.status === 200) {
          setDetails(response.data.problem);
        }
    });
  }, [props.isShown, props.problemId]);

  const closeModal = (e, value) => {
    props.setReplyDetailsModalStatus(false);
  };

  return (
    <Fragment>
      <div
        class="modal fade"
        id="problemReplyModal"
        tabindex="-1"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Reply to renter's problem</h5>
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
                  <label className="customModalLabel">Responder :</label>
                  <input
                    type="text"
                    className="form-control"
                    name="replied_by"
                    value={details.replied_by === null ? "" : details.replied_by}
                  />
                </div>
                <div className="form-group">
                  <label className="customModalLabel">Reply text :</label>
                  <textarea 
                  className="form-control" 
                  name="reply_text"
                  value={details.reply_text === null ? "" : details.reply_text}
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
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
