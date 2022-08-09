import React from 'react'

export default function BreachDetails({ match }) {
    const breachId = match.params.breachID;
  return (
    <div>Breach Details {breachId}</div>
  )
}
