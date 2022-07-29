import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AppUrl from "../../../RestAPI/AppUrl";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

export default function CreateInvoice({ match }) {
  const history = useHistory();
  const [registeredServices, setRegisteredServices] = useState([]);
  const renterId = match.params.renterID;
  const [errors, setErrors] = useState([]);
  const [input, setInput] = useState({
    effective_at: "",
    valid_until: "",
    discount: "",
  });

  useEffect(() => {
    axios.post(AppUrl.CreateTemporaryInvoice + renterId).then((response) => {
      swal("success", response.data.message, "Success");
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
    // const service = {
    //   name: input.name,
    // };
    // axios
    //   .post(AppUrl.StoreService, service)
    //   .then((response) => {
    //     if (response.data.status === 200) {
    //       swal("Success", response.data.message, "success");
    //       history.push("/admin/view-all-services");
    //     } else if (response.data.status === 404) {
    //       setInput({ ...input, errors_list: response.data.errors });
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
                    {item.service.unit_price * item.temporary_quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button type="submit" className="formButton">
          Create
        </button>
      </form>
    </Fragment>
  );
}
