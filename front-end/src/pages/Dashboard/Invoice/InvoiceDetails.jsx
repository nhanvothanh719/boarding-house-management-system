import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AppUrl from "../../../RestAPI/AppUrl";
import swal from "sweetalert";
import axios from "axios";
import Loading from "../../../components/Loading";

export default function InvoiceDetails({ match }) {
  const history = useHistory();
  const invoiceId = match.params.invoiceID;
  const [invoice, setInvoice] = useState({
    month: "",
    effective_from: "",
    valid_until: "",
    renter_id: "",
    discount: "",
    total: "",
    year: "",
    is_paid: "",
  });
  const [extraFee, setExtraFee] = useState({
    subtotal: "",
    description: "",
  });
  const [usedServices, setUsedServices] = useState([
    {
      service_id: "",
      quantity: "",
      subtotal: "",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowServices).then((response) => {
        if (response.data.status === 200) {
          setServicesList(response.data.allServices);
        }
    });
    axios.get(AppUrl.InvoiceDetails + invoiceId).then((response) => {
      if (response.data.status === 200) {
        setInvoice(response.data.invoice);
        setUsedServices(response.data.invoiceDetails);
        setExtraFee(response.data.extraFee[0]);
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-renters-with-invoices");
      }
      setLoading(false);
    });
  }, [invoiceId, history]);

  let serviceNames = [];
  let id;
  servicesList.forEach((service) => {
    id = service["id"];
    serviceNames[id] = service["name"];
  });
  
  if(loading) {
    return <Loading/>
  }
  return (
    <Fragment>
      <form className="">
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
            {usedServices.map((item, index) => {
              return (
                <tr key={index}>
                  <td width="10%" className="text-center">
                    {item.service_id}
                  </td>
                  <td width="20%">{serviceNames[item.service_id]}</td>
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
                    />
                  </td>
                  <td width="20%">
                    {item.subtotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>Total: {invoice.total}</h3>
        <br/><br/><br/>
        <div className="formInput">
              <label>Discount (%):</label>
              <input
                type="text"
                className="inputItem"
                name="discount"
                value={invoice.discount}
              /> 
        </div>
        <div className="formInput">
              <label>Month:</label>
              <input
                type="text"
                className="inputItem"
                name="month"
                value={invoice.month}
              />
        </div>
        <div className="formInput">
              <label>Effective from:</label>
              <input
                type="date"
                className="inputItem"
                name="effective_from"
                value={invoice.effective_from}
              />
        </div>
        <div className="formInput">
              <label>Can be paid until:</label>
              <input
                type="date"
                className="inputItem"
                name="valid_until"
                value={invoice.valid_until}
              />
        </div>
        <div className="formInput">
              <label>Extra fee:</label>
              <input
                type="text"
                className="inputItem"
                name="extra_fee"
                value={extraFee.subtotal}
              />
        </div>
        <div className="formInput">
              <label>Description for extra fee:</label>
              <textarea
                type="text"
                className="inputItem"
                name="description"
                value={extraFee.description}
              />
        </div>
        <button className="btn btn-primary">Generate PDF invoice</button>
      </form>
    </Fragment>
  );
}
