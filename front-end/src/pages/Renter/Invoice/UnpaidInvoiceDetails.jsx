import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as ReactDOM from "react-dom";

import axios from "axios";
import swal from "sweetalert";

import "../../../assets/css/Renter/invoice.css";
import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";

export default function UnpaidInvoiceDetails({ match }) {
    const history = useHistory();
    const invoiceId = match.params.invoiceID;
  
    const [loading, setLoading] = useState(true);
    const [updatePage, setUpdatePage] = useState(false);
    const [invoice, setInvoice] = useState({
      renter: {},
      payment: {
        method: {
          name: "",
        },
      },
      discount: "",
      extra_fee: "",
      extra_fee_description: "",
      total: "",
      month: "",
      year: "",
      effective_from: "",
      valid_until: "",
      is_paid: "",
    });
    const [usedServices, setUsedServices] = useState([
      {
        service_id: "",
        quantity: "",
        subtotal: "",
        service: {},
      },
    ]);
    const [renter, setRenter] = useState({
      name: "",
      email: "",
      phone_number: "",
    });

    var paypalPaymentInfo = {
      payment_method: "Paypal",
      payment_id: "",
      amount: "",
    };
  
    useEffect(() => {
      axios.get(AppUrl.GetInvoiceDetails + invoiceId).then((response) => {
        if (response.data.status === 200) {
          setInvoice(response.data.invoice);
          setUsedServices(response.data.invoiceDetails);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
          history.push("/renter/view-all-invoices");
        }
      });
      axios.get(AppUrl.GetUserProfile).then((response) => {
        setRenter(response.data.currentUser);
      });
      setLoading(false);
      if (updatePage) {
        setUpdatePage(false);
      }
    }, [updatePage, invoiceId, history]);

    
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
    return actions.order.capture().then(function (details) {
      console.log(details);
      paypalPaymentInfo.payment_id = details.id;
      paypalPaymentInfo.amount = invoice.total;
      axios
        .post(AppUrl.MakeInvoicePayment + invoiceId, paypalPaymentInfo)
        .then((response) => {
          if (response.data.status === 200) {
            swal("Invoice is paid", response.data.message, "success");
            setUpdatePage(true);
          }
        });
    });
  };
  //

  //Handle payment
  const makePayment = (e, payment_method) => {
    e.preventDefault();
    if (invoice.is_paid === 1) {
      swal("Error", "The invoice has been paid", "error");
    } else {
      const payment = {
        payment_method: payment_method,
        month: invoice.month,
        year: invoice.year,
        amount: invoice.total,
        payer_id: invoice.renter_id,
      };
      switch (payment_method) {
        case "Razorpay":
          var options = {
            key: "rzp_test_iIhF6VSIWJ0NRp", // Enter the Key ID generated from the Dashboard
            amount: invoice.total * 100,
            name: "BeeHouse",
            description: "Make invoice payment",
            image: "",
            handler: function (response) {
              payment.payment_id = response.razorpay_payment_id;
              axios
                .post(AppUrl.MakeInvoicePayment + invoiceId, payment)
                .then((res) => {
                  if (res.data.status === 200) {
                    swal("success", res.data.message, "success");
                    setUpdatePage(true);
                  }
                });
            },
            prefill: {
              name: renter.name,
              email: renter.email,
              contact: renter.phone_number + "1",
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
          break;
        default:
          break;
      }
    }
  };
  //

  if(loading) {
    return <Loading/>
  }
    return (
      <Fragment>
        <div className="page-content container">
        <div className="page-header text-blue-d2"></div>
  
        <div className="container px-0">
          <div className="row mt-4">
            <div className="col-12 col-lg-12">
              <hr className="row brc-default-l1 mx-n1 mb-4" />
  
              <div className="row">
                <div className="col-sm-6">
                  <div>
                    <span className="text-sm text-grey-m2 align-middle">To: </span>
                    <span className="text-600 text-110 text-blue align-middle">
                      {invoice.renter.name}
                    </span>
                  </div>
                  <div className="text-grey-m2">
                    <div className="my-1">{invoice.renter.email}</div>
                  </div>
                </div>
  
                <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                  <hr className="d-sm-none" />
                  <div className="text-grey-m2">
                    <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">
                      Invoice
                    </div>
  
                    <div className="my-2">
                      <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                      <span className="text-600 text-90">ID:</span> #{invoice.id}
                    </div>
  
                    <div className="my-2">
                      <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                      <span className="text-600 text-90">Status:</span>{" "}
                      <span className={invoice.is_paid ? "badge badge-success badge-pill px-25" : "badge badge-danger badge-pill px-25"}>
                        {invoice.is_paid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="mt-4">
                <div className="row text-600 text-white bgc-default-tp1 py-25">
                  <div className="d-none d-sm-block col-1">#</div>
                  <div className="col-9 col-sm-5">Service name</div>
                  <div className="d-none d-sm-block col-4 col-sm-2">Quantity</div>
                  <div className="d-none d-sm-block col-sm-2">Unit Price</div>
                  <div className="col-2">Amount</div>
                </div>
  
                <div className="text-95 text-secondary-d3">
                  {usedServices.map((item, index) => {
                    return (
                      <div class = {index % 2 === 1 ? "row mb-2 mb-sm-0 py-25" : "row mb-2 mb-sm-0 py-25 bgc-default-l4"}>
                        <div className="d-none d-sm-block col-1">{index + 1}</div>
                        <div className="col-9 col-sm-5">{item.service.name}</div>
                        <div className="d-none d-sm-block col-2">{item.quantity}</div>
                        <div className="d-none d-sm-block col-2 text-95">${item.service.unit_price}</div>
                        <div className="col-2 text-secondary-d2">${item.subtotal}</div>
                      </div>
                    );
                  })}
                </div>
  
                <div className="row mt-3">
                <em className="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0 border" style={{ backgroundColor: "#edf2f4", borderRadius: "20px"}}>
                  {invoice.extra_fee_description === null ? "Extra note such as description of extra fee..." : invoice.extra_fee_description}
                </em>
  
                  <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                    <div className="row my-2">
                      <div className="col-7 text-right">Extra fee</div>
                      <div className="col-5">
                        <span className="text-120 text-secondary-d1">${invoice.extra_fee === null ? "0" : invoice.extra_fee}</span>
                      </div>
                    </div>
  
                    <div className="row my-2">
                      <div className="col-7 text-right">Discount</div>
                      <div className="col-5">
                        <span className="text-110 text-secondary-d1">{invoice.discount === null ? "0" : invoice.discount}%</span>
                      </div>
                    </div>
  
                    <div className="row my-2 align-items-center bgc-primary-l3 p-2">
                      <div className="col-7 text-right">Total Amount</div>
                      <div className="col-5">
                        <span className="text-150 text-d3 opacity-2" style={{ color: "red" }}>
                          ${invoice.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
  
                <hr />
  
                <div>
                  <button 
                  className="btn btn-bold px-4 mt-3 mt-lg-0 mr-3 razorpayBtn"
                  onClick={(e) => makePayment(e, "Razorpay")}>
                    Pay using Razorpay
                  </button>
                  <button className="btn btn-bold px-4 mt-3 mt-lg-0 mr-3 payPalBtn"
                   onClick={(e) => makePayment(e, "Paypal")}
                  >
                    Pay using Paypal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                Invoice payment
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
