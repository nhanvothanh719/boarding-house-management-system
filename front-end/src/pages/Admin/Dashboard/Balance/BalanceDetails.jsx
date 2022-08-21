import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import BalanceVariation from "../../../../components/Charts/BalanceVariation";
import BalanceCategoryRate from "../../../../components/Charts/BalanceCategoryRate";
import AddBalanceChange from "../../../../components/Modals/Balance/AddBalanceChange";

export default function BalanceDetails() {
  var currentDate = new Date();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [balanceAmountChange, setBalanceAmountChange] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("");

  useEffect(() => {
    axios.get(AppUrl.GetBalance).then((response) => {
      if (response.data.status === 200) {
        setDetails(response.data.allDetails);
      }
      setLoading(false);
    });
    axios.get(AppUrl.GetRecentBalanceChanges).then((response) => {
      if (response.data.status === 200) {
        setCurrentBalance(response.data.currentBalance);
      }
    });
    if (balanceAmountChange) {
      setBalanceAmountChange(false);
    }
  }, [balanceAmountChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateCreateModalStatus = (status) => {
    setBalanceAmountChange(status);
  };

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "description",
        title: "Description",
        validate: (rowData) =>
          rowData.description === ""
            ? { isValid: false, helperText: "Description cannot be empty" }
            : true,
      },
      {
        field: "is_income",
        title: "Category",
        lookup: { 0: "Expenses", 1: "Earned" },
        render: rowData => (
          <div>
              <span className={`${rowData.is_income === 0 ? "expense" : "earned"}` }>{rowData.is_income === 0 ? "Expenses" : "Earned" }</span>
          </div>
        )
      },
      {
        field: "amount",
        title: "Amount",
        type: "numeric",
        validate: (rowData) =>
          rowData.amount <= 0
            ? { isValid: false, helperText: "Amount must bigger than 0" }
            : true,
      },
      {
        field: "occurred_on",
        title: "Occurred on",
        type: "date",
        validate: (rowData) =>
          rowData.occurred_on >= currentDate ||
          rowData.occurred_on <
            currentDate.setFullYear(currentDate.getFullYear() - 1)
            ? { isValid: false, helperText: "Inappropriate value" }
            : true,
      },
    ];
  }

  return (
    <Fragment>
      <h1 className="currentBalance center">
        Current Balance: $
        <span>{currentBalance}</span>
      </h1>
      {/* Line Chart */}
      <BalanceVariation />
      {/* Pie Chart */}
      <BalanceCategoryRate />
      {/* DataTable */}
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={(e) => setShowCreateModal(true)}
          >
            <AddBalanceChange
              isShown={showCreateModal}
              setCreateModalStatus={setCreateModalStatus}
              updateCreateModalStatus={updateCreateModalStatus}
            />
            Add new change
          </Button>
        </div>
        <MaterialTable
          columns={columns}
          data={details}
          title={<span className="customDatatableTitle">All balance changes</span>}
          options={{
            searchAutoFocus: false,
            searchFieldVariant: "outlined",
            filtering: false,
            pageSizeOptions: [5, 10],
            paginationType: "stepped",
            exportButton: true,
            exportAllData: true,
            actionsColumnIndex: -1,
            headerStyle: {
              fontFamily: 'Anek Telugu, sans-serif',
            }
          }}
          editable={{
            onRowUpdate: (newBalanceChange, oldBalanceChange) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const data = {
                    amount: newBalanceChange.amount,
                    description: newBalanceChange.description,
                    occurred_on: newBalanceChange.occurred_on,
                  };
                  axios
                    .put(AppUrl.UpdateBalanceChange + oldBalanceChange.id, data)
                    .then((response) => {
                      if (response.data.status === 200) {
                        swal("Success", response.data.message, "success");
                        setBalanceAmountChange(true);
                      } else if (response.data.status === 404) {
                        swal("Error", response.data.message, "error");
                      }
                    });
                  resolve();
                }, 1000);
              }),
            onRowDelete: (thisBalanceChange) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const selectedBalanceChange = [...details];
                  const index = thisBalanceChange.tableData.id;
                  selectedBalanceChange.splice(index, 1); //1: only one record
                  axios
                    .delete(AppUrl.DeleteBalanceChange + thisBalanceChange.id)
                    .then((response) => {
                      if (response.data.status === 200) {
                        swal("Success", response.data.message, "success");
                        setBalanceAmountChange(true);
                      } else if (response.data.status === 404) {
                        swal("Error", response.data.message, "error");
                      }
                    });
                  resolve();
                }, 1000);
              }),
          }}
        />
      </div>
    </Fragment>
  );
}
