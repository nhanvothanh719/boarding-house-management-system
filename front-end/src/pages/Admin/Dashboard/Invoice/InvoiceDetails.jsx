import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import swal from "sweetalert";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Visibility } from "@material-ui/icons";
import MailIcon from "@mui/icons-material/Mail";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import "../../../../assets/css/Dashboard/datatable.css";
import { IconButton, Tooltip } from "@mui/material";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function InvoiceDetails({ match }) {
  const history = useHistory();
  const invoiceId = match.params.invoiceID;

  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState([]);
  const [invoice, setInvoice] = useState({
    month: "",
    effective_from: "",
    valid_until: "",
    renter_id: "",
    discount: "",
    total: "",
    year: "",
    is_paid: "",
    extra_fee: "",
    extra_fee_description: "",
  });
  const [usedServices, setUsedServices] = useState([
    {
      service_id: "",
      quantity: "",
      subtotal: "",
    },
  ]);

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
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-renters-with-invoices");
      }
      setLoading(false);
    });
  }, [invoiceId, history]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Send email
  const sendInvoice = () => {
    axios.get(AppUrl.SendInvoice + invoiceId).then((response) => {
      if (response.data.status === 200) {
        swal("Invoice has been sent", response.data.message, "success");
        //history.push("");
      } else if (response.data.status === 404) {
        swal("Error", response.data.message, "error");
        history.push("/admin/view-all-renters-with-invoices");
      }
    });
  };
  //

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
      <WebPageTitle pageTitle="Invoice details" />
      <div className="room">
        <div className="titleContainer">
          <h1 className="customActionTitle">View & Edit invoice</h1>
        </div>
        <div className="roomTop">
          <div className="roomTopLeft">
            <div className="leftContainer">
              <div className="roomInfoTop">
                <span className="customFieldTitle">Invoice Details</span>
              </div>
              <div className="roomInfoBottom">
              <div className="roomInfoItem">
                  <span className="roomInfoKey">Owner:</span>
                  <span className="roomInfoValue">{invoice.renter.name}</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Discount (%):</span>
                  <span className="roomInfoValue">{invoice.discount}</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Month:</span>
                  <span className="roomInfoValue">{invoice.month}</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Effective from:</span>
                  <span className="roomInfoValue">
                    {invoice.effective_from}
                  </span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Can be paid until:</span>
                  <span className="roomInfoValue">{invoice.valid_until}</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Extra fee:</span>
                  <span className="roomInfoValue">{invoice.extra_fee === null ? "" : invoice.extra_fee}</span>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">
                    Description for extra fee:
                  </span>
                  <span className="roomInfoValue">
                    <Tooltip title="View description">
                      <IconButton  onClick={handleClickOpen}>
                        <Visibility color="#7E909A" />
                      </IconButton>
                    </Tooltip>
                  </span>
                  <Dialog
                    open={open}
                    maxWidth="sm"
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle
                      id="alert-dialog-title"
                      class="customModalTitle"
                      style={{ margin: "30px" }}
                    >
                      {"Description for extra fee"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        {invoice.extra_fee_description === null ? <em>Nothing to show</em> : invoice.extra_fee_description}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="outlined"
                        onClick={handleClose}
                        autoFocus
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
                <div className="roomInfoItem">
                  <span className="roomInfoKey">Status:</span>
                  <span
                    className="roomInfoValue"
                    style={{ color: "#0091D5", fontWeight: "bold" }}
                  >
                    {invoice.is_paid === 1 ? "Paid" : "Not Paid"}
                  </span>
                </div>
                <div
                  className="roomInfoItem"
                  style={{ color: "#EA6A47", fontWeight: "bold" }}
                >
                  <span className="roomInfoKey">Total:</span>
                  <span className="roomInfoValue">{invoice.total}</span>
                </div>
                <center>
                <Tooltip title="Send to renter">
                  <IconButton onClick={sendInvoice}>
                    <MailIcon color="primary" fontSize="large"/>
                  </IconButton>
                </Tooltip>
                </center>
              </div>
            </div>
          </div>
          <div className="roomTopRight">
            <span className="customFieldTitle">Used Services</span>
            <table class="table table-striped" style={{ marginTop: "20px" }}>
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
                    style={{ border: "1px solid", borderCollapse: "collapse" }}
                  >
                    Service name
                  </th>
                  <th
                    scope="col"
                    style={{ border: "1px solid", borderCollapse: "collapse" }}
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    style={{ border: "1px solid", borderCollapse: "collapse" }}
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {usedServices.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td
                        width="60%"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                        }}
                      >
                        {serviceNames[item.service_id]}
                      </td>
                      <td
                        width="20%"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        width="20%"
                        style={{
                          border: "1px solid",
                          borderCollapse: "collapse",
                          fontWeight: "bold",
                        }}
                      >
                        {item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
