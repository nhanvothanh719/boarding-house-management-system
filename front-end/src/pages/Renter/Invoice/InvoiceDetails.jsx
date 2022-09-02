import React from 'react'

export default function InvoiceDetails({ match }) {
  const invoiceId = match.params.invoiceID;

  return (
    <div>Invoice Details {invoiceId}</div>
  )
}
