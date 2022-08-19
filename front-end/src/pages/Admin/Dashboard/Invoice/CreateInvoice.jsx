import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import AppUrl from "../../../../RestAPI/AppUrl";

export default function CreateInvoice({ match }) {
  const history = useHistory();
  const renterId = match.params.renterID;
  var totalPrice = 0;

  const [registeredServices, setRegisteredServices] = useState([]);
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    effective_from: "",
    valid_until: "",
    discount: "",
    month: "",
    extra_fee: "",
    description: "",
  });
  const [effectiveFromDate, setEffectiveFromDate] = useState(moment());
  const [validUntilDate, setValidUntilDate] = useState(moment());

  useEffect(() => {
    axios.get(AppUrl.GetRegisteredServices + renterId).then((response) => {
      if (response.data.status === 200) {
        setRegisteredServices(response.data.allServices);
      }
    });
  }, [renterId]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleServiceAmountInput = (service_id, e, index) => {
    setRegisteredServices((registeredServices) =>
      registeredServices.map((service) =>
        service_id === service.id
          ? { ...service, quantity: e.target.value }
          : service
      )
    );
  };

  const createInvoice = (e) => {
    e.preventDefault();
    const invoice = {
      services: registeredServices,
      discount: input.discount,
      effective_from: moment(effectiveFromDate).utc().format("YYYY-MM-DD"),
      valid_until: moment(validUntilDate).utc().format("YYYY-MM-DD"),
      month: input.month,
      extra_fee: input.extra_fee,
      description: input.description,
    };
    console.log(invoice);
    axios
      .post(AppUrl.StoreInvoice + renterId, invoice)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
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
  };

  return (
    <Fragment>
      <div>Create invoice for renter id: {renterId}</div>
      <form className="" onSubmit={createInvoice}>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Service name</th>
              <th scope="col">Compulsory/Optional</th>
              <th scope="col">Amount</th>
              <th scope="col">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {registeredServices.map((item, index) => {
              totalPrice += item.unit_price * item.quantity;
              return (
                <tr key={index}>
                  <td width="20%">{item.name}</td>
                  <td width="15%">
                    {item.is_compulsory === 1 ? "Compulsory" : "Optional"}
                  </td>
                  <td width="10%">
                    <input
                      type="text"
                      className="form-control"
                      name="quantity"
                      defaultValue={0}
                      value={item.quantity}
                      onChange={(e) =>
                        handleServiceAmountInput(item.id, e, index)
                      }
                    />
                  </td>
                  <td width="20%">
                    {(item.unit_price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>Total: {totalPrice.toFixed(2)}</h3>
        <br />
        <br />
        <br />
        <div className="formInput">
          <label>Discount (%):</label>
          <input
            type="text"
            className="inputItem"
            name="discount"
            onChange={handleInput}
            value={input.discount}
          />
        </div>
        <small className="text-danger">{errors.discount}</small>
        <div className="formInput">
          <label>Month:</label>
          <input
            type="text"
            className="inputItem"
            name="month"
            onChange={handleInput}
            value={input.month}
          />
        </div>
        <small className="text-danger">{errors.month}</small>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="formInput">
          <label>Effective from:</label>
          <DatePicker
            views={["day", "month", "year"]}
            label="Effective from"
            name="effective_from"
            value={effectiveFromDate}
            onChange={(selectedDate) => {
              setEffectiveFromDate(selectedDate);
            }}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
          <small className="text-danger">{errors.effective_from}</small>
          </div>
          <div className="formInput">
          <label>Can be paid until:</label>
          <DatePicker
            views={["day", "month", "year"]}
            label="Effective until"
            name="valid_until"
            value={validUntilDate}
            onChange={(selectedDate) => {
              setValidUntilDate(selectedDate);
            }}
            renderInput={(params) => (
              <TextField {...params} helperText={null} />
            )}
          />
          <small className="text-danger">{errors.valid_until}</small>
          </div>
        </LocalizationProvider>
        <div className="formInput">
          <label>Extra fee:</label>
          <input
            type="text"
            className="inputItem"
            name="extra_fee"
            onChange={handleInput}
            value={input.extra_fee}
          />
        </div>
        <small className="text-danger">{errors.extra_fee}</small>
        <div className="formInput">
          <label>Description for extra fee:</label>
          <textarea
            type="text"
            className="inputItem"
            name="description"
            onChange={handleInput}
            value={input.description}
          />
        </div>
        <small className="text-danger">{errors.description}</small>
        <button type="submit" className="formButton">
          Create
        </button>
      </form>
    </Fragment>
  );
}
