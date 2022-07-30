import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AppUrl from "../../../RestAPI/AppUrl";
import swal from "sweetalert";
import axios from "axios";
import Loading from "../../../components/Loading";

export default function EditInvoice({ match }) {
  const history = useHistory();
  const invoiceId = match.params.invoiceID;
  const [invoiceInput, setInvoiceInput] = useState({
    month: "",
    effective_from: "",
    valid_until: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.InvoiceDetails + invoiceId).then((response) => {
      if (response.data.status === 200) {
        setInvoiceInput(response.data.invoice);
      }  else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-renters-with-invoices");
      }
      setLoading(false);
    });
  }, [invoiceId, history]);

  const updateInvoice = (e) => {
    e.preventDefault();
     const invoice = {
      effective_from: invoiceInput.effective_from,
      valid_until: invoiceInput.valid_until,
      month: invoiceInput.month,
     };
     axios
       .put(AppUrl.UpdateInvoice + invoiceId, invoice)
       .then((response) => {
         if (response.data.status === 200) {
           swal("Success", response.data.message, "success");
           setErrors([]);
           history.push("/admin/view-all-renters-with-invoices");
         } else if (response.data.status === 422) {
           swal("All fields are mandatory", "", "error");
           setErrors(response.data.errors);
         } else if (response.data.status === 404) {
           swal("Error", response.data.message, "error");
         }
       })
       .catch((error) => {
         console.log(error);
       });
  }

  const handleInput = (e) => {
    e.persist();
    setInvoiceInput({ ...invoiceInput, [e.target.name]: e.target.value });
  }

  return (
    <Fragment>
      <div>Edit invoice with id: {invoiceId}</div>
      <form className="" onSubmit={updateInvoice}>
        <div className="formInput">
              <label>Month:</label>
              <input
                type="text"
                className="inputItem"
                name="month"
                onChange={handleInput}
                value={invoiceInput.month}
              />
        </div>
        <small className="text-danger">{errors.month}</small>
        <div className="formInput">
              <label>Effective from:</label>
              <input
                type="date"
                className="inputItem"
                name="effective_from"
                onChange={handleInput}
                value={invoiceInput.effective_from}
              />
        </div>
        <small className="text-danger">{errors.effective_from}</small>
        <div className="formInput">
              <label>Can be paid until:</label>
              <input
                type="date"
                className="inputItem"
                name="valid_until"
                onChange={handleInput}
                value={invoiceInput.valid_until}
              />
        </div>
        <small className="text-danger">{errors.valid_until}</small>
        <button type="submit" className="formButton">
          Update
        </button>
      </form>
    </Fragment>
  )
}
