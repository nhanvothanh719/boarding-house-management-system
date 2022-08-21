import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import RenterInvoicePaid from "../../../../components/Charts/RenterInvoicePaid";
import RenterUsedServiceCount from "../../../../components/Charts/RenterUsedServiceCount";

export default function RenterInvoicesList({ match }) {
  const renterId = match.params.renterID;
  const [invoicesList, setInvoicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(AppUrl.GetRenterInvoices + renterId).then((response) => {
      if (response.data.status === 200) {
        setInvoicesList(response.data.allInvoices);
      }
    });
    setLoading(false);
  }, [renterId]);

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <p>All invoices of renter {renterId}</p>
      <div>
        {invoicesList.map((invoice) => {
          return <p>{invoice.id}</p>;
        })}
      </div>
      <RenterInvoicePaid renterId={renterId}/>
      <p>Chart for used services </p>
      <RenterUsedServiceCount renterId={renterId}/>
    </Fragment>
  );
}
