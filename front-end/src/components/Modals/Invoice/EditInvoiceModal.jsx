import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AppUrl from "../../../RestAPI/AppUrl";

export default function EditInvoiceModal(props) {
    const [errors, setErrors] = useState([]);
    const [input, setInput] = useState({
      month: "",
      effective_from: "",
    });
    const [validUntilDate, setValidUntilDate] = useState(moment());

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("editInvoiceModal")
      );
      model.show();
      axios.get(AppUrl.InvoiceDetails + props.invoiceId).then((response) => {
        if (response.data.status === 200) {
          setValidUntilDate(moment(response.data.invoice.valid_until));
          setInput(response.data.invoice);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      });
    }
  }, [props.isShown, props.invoiceId]);

  const displayModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("editInvoiceModal")
    );
    model.show();
  };

  const closeModal = (e, value) => {
    props.setEditModalStatus(false);
  };

  const updateInvoice = (e) => {
    e.preventDefault();
    props.setLoaderClass('');
    props.setDisplayComponentsClass('d-none');
    const invoice = {
      month: input.month,
      effective_from: input.effective_from,
      valid_until: moment(validUntilDate).format("YYYY-MM-DD"),
    };
    axios
      .put(AppUrl.UpdateInvoice + props.invoiceId, invoice)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          swal("Success", response.data.message, "success");
          props.updateModalStatus(true);
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
        id="editInvoiceModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">Add more days to invoice deadline {moment(validUntilDate).format("DD/MM/YYYY")}</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div>
                    <label className="customModalLabel">Valid until:</label>
                    <DatePicker
                      label="Valid until"
                      name="valid_until"
                      value={validUntilDate}
                      onChange={(selectedDate) => {
                        setValidUntilDate(selectedDate);
                      }}
                      renderInput={(params) => (
                        <TextField fullWidth {...params} helperText={null} />
                      )}
                    />
                  </div>
                  <small className="text-danger customSmallError">
                    {errors.valid_until}
                  </small>
                </LocalizationProvider>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-dismiss="modal"
                onClick={updateInvoice}
              >
                Update
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
