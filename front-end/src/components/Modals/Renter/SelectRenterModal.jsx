import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import SearchRenter from "../../Search/SearchRenter";

export default function SelectRenterModal(props) {
    const history = useHistory();
    const [selectedRenter, setSelectedRenter] = useState(null);

    useEffect(() => {
        if (props.isShown === true) {
          var model = new window.bootstrap.Modal(
            document.getElementById("selectRenterModal")
          );
          model.show();
        }
      }, [props.isShown]);
    
      const closeModal = (e, value) => {
        props.setCreateModalStatus(false);
      };
    
      const getSelectedRenter = (renter) => {
        setSelectedRenter(renter);
      };

      const generateInvoiceForm = (e) => {
        e.preventDefault();
        history.push(`/admin/create-invoice/${selectedRenter.id}`);
      }
      
  return (
    <Fragment>
      <div
        class="modal fade"
        id="selectRenterModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Choose a renter
              </h5>
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
              <form className="">
                <div className="formInput">
                  <label>Renter ID:</label>
                  <SearchRenter getSelectedRenter={getSelectedRenter} />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={generateInvoiceForm}
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
      </div>
    </Fragment>
  )
}
