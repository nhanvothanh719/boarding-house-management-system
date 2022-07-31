import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AppUrl from "../../../RestAPI/AppUrl";
import swal from "sweetalert";
import axios from "axios";
import Loading from "../../../components/Loading";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as ReactDOM from "react-dom";
import { ActionTypes } from "@mui/base";

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
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  var paymentInfo = {
    payment_method: "Paypal",
    payment_id: '',
  }

  useEffect(() => {
    axios.get(AppUrl.ShowServices).then((response) => {
      if (response.data.status === 200) {
        setServicesList(response.data.allServices);
      }
    });
    axios.get(AppUrl.GetUserProfile).then((response) => {
      setUser(response.data);
      console.log(response.data);
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

  //Paypal components
  const PayPalButton = window.paypal.Buttons.driver("react", {
    React,
    ReactDOM,
  });
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: invoice.total,
          },
        },
      ],
    });
  };
  //When make payment successfully
  const onApprove = (data, actions) => {
    return actions.order.capture().then(function(details) {
      console.log(details);
      paymentInfo.payment_id = details.id;
      axios
            .post(AppUrl.MakeInvoicePayment + invoiceId, paymentInfo)
            .then((response) => {
              if (response.data.status === 200) {
                swal("Invoice is paid", response.data.message, "success");
                history.push("");
              }
            });
    })
  };
  //

  const makePayment = (e, payment_method) => {
    e.preventDefault();
    if (invoice.is_paid === 1) {
      swal("Error", "The invoice has been paid", "error");
    } else {
      const payment = {
        payment_method: payment_method,
      };
      switch (payment_method) {
        case "Cash":
          axios
            .post(AppUrl.MakeInvoicePayment + invoiceId, payment)
            .then((response) => {
              if (response.data.status === 200) {
                swal("Invoice is paid", response.data.message, "success");
                history.push("");
              }
            });
          break;
        case "Razorpay":
          var options = {
            key: "rzp_test_iIhF6VSIWJ0NRp", // Enter the Key ID generated from the Dashboard
            amount: invoice.total * 100,
            //"currency": "",
            name: "BeeHouse",
            description: "Make invoice payment",
            image: "",
            handler: function (response) {
              //alert(response.razorpay_payment_id);
              payment.payment_id = response.razorpay_payment_id;
              axios
                .post(AppUrl.MakeInvoicePayment + invoiceId, payment)
                .then((res) => {
                  if (res.data.status === 200) {
                    swal("success", res.data.message, "Success");
                  }
                });
              alert(response.razorpay_payment_id);
            },
            prefill: {
              name: user.name,
              email: user.email,
              contact: user.phone_number,
            },
            theme: {
              color: "#3399cc",
            },
          };
          var razorpay = new window.Razorpay(options);
          razorpay.open();
          break;
        case "Paypal":
          //Show modal
          var paypalPaymentModal = new window.bootstrap.Modal(
            document.getElementById("paypalPaymentModal")
          );
          paypalPaymentModal.show();
          //

          break;
        default:
          break;
      }
    }
  };

  let serviceNames = [];
  let id;
  servicesList.forEach((service) => {
    id = service["id"];
    serviceNames[id] = service["name"];
  });

  if (loading) {
    return <Loading />;
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
                  <td width="20%">{item.subtotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>Total: {invoice.total}</h3>
        <br />
        <br />
        <br />
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
        <div className="formInput">
          <label>Is paid:</label>
          <textarea
            type="text"
            className="inputItem"
            name="is_paid"
            value={invoice.is_paid === 1 ? "Yes" : "No"}
          />
        </div>
      </form>
      <button className="btn btn-primary">Generate PDF invoice</button>
      <br />
      <br />
      <button
        className="btn btn-primary"
        onClick={(e) => makePayment(e, "Razorpay")}
      >
        Razorpay
      </button>
      <br />
      <br />
      <button
        className="btn btn-primary"
        onClick={(e) => makePayment(e, "Paypal")}
      >
        Paypal
      </button>
      <div
        class="modal fade"
        id="paypalPaymentModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
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
