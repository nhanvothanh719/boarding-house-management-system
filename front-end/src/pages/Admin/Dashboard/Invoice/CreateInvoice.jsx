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
import { Button } from "react-bootstrap";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function CreateInvoice({ match }) {
  const history = useHistory();
  const renterId = match.params.renterID;
  var totalPrice = 0;

  const [compulsoryServices, setCompulsoryServices] = useState([]);
  const [registeredServices, setRegisteredServices] = useState([]);
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    effective_from: "",
    valid_until: "",
    discount: "",
    month: "",
    extra_fee: "",
    extra_fee_description: "",
  });
  const [effectiveFromDate, setEffectiveFromDate] = useState(moment());
  const [validUntilDate, setValidUntilDate] = useState(moment());

  useEffect(() => {
    axios.get(AppUrl.GetRegisteredServices + renterId).then((response) => {
      if (response.data.status === 200) {
        setRegisteredServices(response.data.allServices);
      }
    });
    axios.get(AppUrl.GetCompulsoryServices).then((response) => {
      if (response.data.status === 200) {
        setCompulsoryServices(response.data.allCompulsoryServices);
      }
    });
  }, [renterId]);

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleRegisteredServiceAmountInput = (service_id, e, index) => {
    setRegisteredServices((registeredServices) =>
      registeredServices.map((service) =>
        service_id === service.id
          ? { ...service, quantity: e.target.value }
          : service
      )
    );
  };

  const handleCompulsoryServiceAmountInput = (service_id, e, index) => {
    setCompulsoryServices((compulsoryServices) =>
    compulsoryServices.map((service) =>
        service_id === service.id
          ? { ...service, quantity: e.target.value }
          : service
      )
    );
  };

  const createInvoice = (e) => {
    e.preventDefault();
    const invoice = {
      services: ([...registeredServices, ...compulsoryServices]),
      discount: input.discount,
      effective_from: moment(effectiveFromDate).utc().format("YYYY-MM-DD"),
      valid_until: moment(validUntilDate).utc().format("YYYY-MM-DD"),
      month: input.month,
      extra_fee: input.extra_fee,
      extra_fee_description: input.extra_fee_description,
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
        } else if (response.data.status === 400) {
          swal("Warning", response.data.message, "warning");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      <WebPageTitle pageTitle="Create invoice" />
      <div className="room">
        <div className="titleContainer">
          <h1 className="customActionTitle">Create invoice</h1>
        </div>
        <form className="" onSubmit={createInvoice}>
          <div className="roomTop">
            <div className="roomTopLeft">
              <div className="leftContainer">
                <div className="roomInfoTop">
                  <span className="customFieldTitle">Optional Services</span>
                </div>
                <table
                  class="table table-striped"
                  style={{ marginTop: "20px" }}
                >
                  <thead
                    style={{
                      backgroundColor: "#1C4E80",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <tr>
                      <th
                        scope="col"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                        }}
                      >
                        Service name
                      </th>
                      <th
                        scope="col"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                        }}
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                        }}
                      >
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredServices.map((item, index) => {
                      totalPrice += item.unit_price * Math.abs(item.quantity);
                      return (
                        <tr key={index}>
                          <td
                            width="50%"
                            style={{
                              border: "1px solid",
                              borderCollapse: "collapse",
                            }}
                          >
                            {item.name}
                          </td>
                          <td
                            width="25%"
                            style={{
                              border: "1px solid",
                              borderCollapse: "collapse",
                            }}
                          >
                            <input
                              type="number"
                              className="form-control"
                              name="quantity"
                              min={0}
                              defaultValue={0}
                              value={item.quantity}
                              onChange={(e) =>
                                handleRegisteredServiceAmountInput(item.id, e, index)
                              }
                            />
                          </td>
                          <td
                            width="25%"
                            style={{
                              border: "1px solid",
                              borderCollapse: "collapse",
                              fontWeight: "bold",
                            }}
                          >
                            {(
                              item.unit_price * Math.abs(item.quantity)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="roomInfoTop">
                  <span className="customFieldTitle">Compulsory Services</span>
                </div>
                <table
                  class="table table-striped"
                  style={{ marginTop: "20px" }}
                >
                  <thead
                    style={{
                      backgroundColor: "#1C4E80",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <tr>
                      <th
                        scope="col"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                        }}
                      >
                        Service name
                      </th>
                      <th
                        scope="col"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                        }}
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                        }}
                      >
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {compulsoryServices.map((item, index) => {
                      totalPrice += item.unit_price * Math.abs(item.quantity);
                      return (
                        <tr key={index}>
                          <td
                            width="50%"
                            style={{
                              border: "1px solid",
                              borderCollapse: "collapse",
                            }}
                          >
                            {item.name}
                          </td>
                          <td
                            width="25%"
                            style={{
                              border: "1px solid",
                              borderCollapse: "collapse",
                            }}
                          >
                            <input
                              type="number"
                              className="form-control"
                              name="quantity"
                              min={0}
                              defaultValue={0}
                              value={item.quantity}
                              onChange={(e) =>
                                handleCompulsoryServiceAmountInput(item.id, e, index)
                              }
                            />
                          </td>
                          <td
                            width="25%"
                            style={{
                              border: "1px solid",
                              borderCollapse: "collapse",
                              fontWeight: "bold",
                            }}
                          >
                            {(
                              item.unit_price * Math.abs(item.quantity)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                <small className="text-danger">{errors.quantity}</small>
                <div
                  className="roomInfoItem"
                  style={{ color: "#EA6A47", fontWeight: "bold" }}
                >
                  <span className="roomInfoKey">Total:</span>
                  <span className="roomInfoValue">{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="roomTopRight">
              <div className="roomInfoTop">
                <span className="customFieldTitle">Invoice Details</span>
              </div>
              <div className="roomFormLeft">
                <label>Discount (%):</label>
                <input
                  type="text"
                  name="discount"
                  onChange={handleInput}
                  value={input.discount}
                />
                <small className="text-danger">{errors.discount}</small>
                <label>Month:</label>
                <input
                  type="text"
                  name="month"
                  onChange={handleInput}
                  value={input.month}
                />
                <small className="text-danger">{errors.month}</small>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                </LocalizationProvider>
                <label>Extra fee:</label>
                <input
                  type="text"
                  name="extra_fee"
                  onChange={handleInput}
                  value={input.extra_fee}
                />
                <small className="text-danger">{errors.extra_fee}</small>
                <label>Description for extra fee:</label>
                <textarea
                  type="text"
                  name="extra_fee_description"
                  onChange={handleInput}
                  value={input.extra_fee_description}
                />
                <small className="text-danger">
                  {errors.extra_fee_description}
                </small>
                <center>
                  <Button
                    className="createBtn"
                    style={{ backgroundColor: "white", color: "#1C4E80", marginTop: "10px" }}
                    type="submit"
                  >
                    Add new invoice
                  </Button>
                </center>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
