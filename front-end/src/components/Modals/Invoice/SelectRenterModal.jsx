import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import SearchRenter from "../../Search/SearchRenter";

export default function SelectRenterModal(props) {
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const [selectedRenter, setSelectedRenter] = useState(null);

    useEffect(() => {
        if (props.isShown === true) {
          var model = new window.bootstrap.Modal(
            document.getElementById("selectRenterModal")
          );
          model.show();
        }
      }, [props.isShown]);

      const displayModal = () => {
        var model = new window.bootstrap.Modal(
          document.getElementById("selectRenterModal")
        );
        model.show();
      };
    
      const closeModal = (e, value) => {
        props.setCreateModalStatus(false);
      };
    
      const getSelectedRenter = (renter) => {
        setSelectedRenter(renter);
      };

      const generateInvoiceForm = (e) => {
        e.preventDefault();
        if(selectedRenter === null) {
          setErrors({ renter_id: "The renter field is required." });
              setTimeout(() => {
                displayModal();
              }, 1000);
        }
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
              <h5 class="customModalTitle" id="exampleModalLabel">
                Add new invoice
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
                <div>
                  <label className="customModalLabel">Renter ID:</label>
                  <SearchRenter getSelectedRenter={getSelectedRenter} />
                </div>
                <small className="text-danger customSmallError">{errors.renter_id}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
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
