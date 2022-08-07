import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";

import AppUrl from "../../../../RestAPI/AppUrl";

export default function CreateInvoice({ match }) {
  const history = useHistory();
  const [registeredServices, setRegisteredServices] = useState([]);
  const renterId = match.params.renterID;
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    effective_from: "",
    valid_until: "",
    discount: "",
    month: "",
    extra_fee: "",
    description: "",
  });
  var totalPrice = 0;

  useEffect(() => {
    axios.post(AppUrl.CreateTemporaryInvoice + renterId).then((response) => {
      if(response.data.status === 200) {
        swal("success", response.data.message, "Success");
      }
    });
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
          ? { ...service, temporary_quantity: e.target.value }
          : service
      )
    );
    updateServiceQuantity(service_id, index);
  };

  const updateServiceQuantity = (service_id, index) => {
    var servicesAmountInput = document.getElementsByName("quantity");
    //console.log(servicesAmountInput[index].value);
    var input = servicesAmountInput[index].value;
    if(input) {
      //console.log("Update service with ID " + service_id + " with value: " + input);
      axios.post(`/update-service-quantity/${service_id}/${input}`);
    }
  };

  const createInvoice = (e) => {
    e.preventDefault();
    const otherInput = {
      discount: input.discount,
      effective_from: input.effective_from,
      valid_until: input.valid_until,
      month: input.month,
      extra_fee: input.extra_fee,
      description: input.description,
    };
    axios
      .post(AppUrl.StoreInvoice + renterId, otherInput)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          history.push("/admin/view-all-renters-with-invoices");
        }
        else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        } 
        else if (response.data.status === 404) {
          setInput({ ...input, errors_list: response.data.errors });
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
              <th scope="col">ID</th>
              <th scope="col">Service name</th>
              <th scope="col">Compulsory/Optional</th>
              <th scope="col">Amount</th>
              <th scope="col">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {registeredServices.map((item, index) => {
              totalPrice += item.service.unit_price * item.temporary_quantity
              return (
                <tr key={index}>
                  <td width="10%" className="text-center">
                    {item.service.id}
                  </td>
                  <td width="20%">{item.service.name}</td>
                  <td width="15%">
                    {item.is_compulsory === 1 ? "Compulsory" : "Optional"}
                  </td>
                  <td width="10%">
                    <input
                      type="text"
                      className="form-control"
                      name="quantity"
                      defaultValue={0}
                      value={item.temporary_quantity}
                      onChange={(e) => handleServiceAmountInput(item.id, e, index)}
                    />
                  </td>
                  <td width="20%">
                    {(item.service.unit_price * item.temporary_quantity).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>Total: {totalPrice.toFixed(2)}</h3>
        <br/><br/><br/>
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
        <div className="formInput">
              <label>Effective from:</label>
              <input
                type="date"
                className="inputItem"
                name="effective_from"
                onChange={handleInput}
                value={input.effective_from}
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
                value={input.valid_until}
              />
        </div>
        <small className="text-danger">{errors.valid_until}</small>
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
