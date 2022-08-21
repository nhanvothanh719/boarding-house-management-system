import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import BalanceVariation from "../../../../components/Charts/BalanceVariation";
import BalanceCategoryRate from "../../../../components/Charts/BalanceCategoryRate";

export default function BalanceDetails() {
  var currentDate = new Date();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [input, setInput] = useState({
    description: "",
    is_income: "",
    amount: "",
    occurred_on: "",
  });
  const [balanceAmountChange, setBalanceAmountChange] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("");

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios.get(AppUrl.GetBalance).then((response) => {
      if (response.data.status === 200) {
        setDetails(response.data.allDetails);
        //console.log(response.data.allDetails);
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

  const showModal = (e) => {
    var model = new window.bootstrap.Modal(
      document.getElementById("paypalPaymentModal")
    );
    model.show();
  };

  const addBalanceChange = (e) => {
    e.preventDefault();
    const data = {
      is_income: input.is_income,
      amount: input.amount,
      description: input.description,
      occurred_on: input.occurred_on,
    };
    axios
      .post(AppUrl.UpdateBalance, data)
      .then((response) => {
        if (response.data.status === 200) {
          setInput({
            description: "",
            is_income: "",
            amount: "",
            occurred_on: "",
          });
          swal("Success", response.data.message, "success");
          setBalanceAmountChange(true);
        } else if (response.data.status === 404) {
          setInput({ ...input, errors_list: response.data.errors });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
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
      <div>Balance Details</div>
      <h1>
        Current Balance:
        {currentBalance}
      </h1>
      {/* Line Chart */}
      <BalanceVariation/>
      {/* Pie Chart */}
      <BalanceCategoryRate/>
      {/* DataTable */}
      <MaterialTable
        columns={columns}
        data={details}
        title="All changes"
        options={{
          searchAutoFocus: false,
          searchFieldVariant: "outlined",
          filtering: false,
          pageSizeOptions: [5, 10],
          paginationType: "stepped",
          exportButton: true,
          exportAllData: true,
          actionsColumnIndex: -1,
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
      <button className="btn btn-primary" onClick={showModal}>
        Add new change
      </button>
      {/* Modal */}
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
                Add change to balance
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
              <form className="flexForm" id="createCategoryForm">
                <div className="formInput">
                  <label className="inputItemLabel">
                    Description (Source):
                  </label>
                  <input
                    type="text"
                    className="inputItem"
                    name="description"
                    onChange={handleInput}
                    value={input.description}
                    id="inputDescription"
                  />
                </div>
                <div className="formInput">
                  <label>Category:</label>
                  <select
                    class="form-control"
                    name="is_income"
                    onChange={handleInput}
                    value={input.is_income}
                  >
                    <option selected>--- Select category ---</option>
                    <option value="0" key="0">
                      {" "}
                      Expenses{" "}
                    </option>
                    <option value="1" key="1">
                      {" "}
                      Earned{" "}
                    </option>
                  </select>
                </div>

                <div className="formInput">
                  <label className="inputItemLabel">Amount:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="amount"
                    onChange={handleInput}
                    value={input.amount}
                    id="inputAmount"
                  />
                </div>
                <div className="formInput">
                  <label className="inputItemLabel">Occurred on:</label>
                  <input
                    type="date"
                    className="inputItem"
                    name="occurred_on"
                    onChange={handleInput}
                    value={input.occurred_on}
                    id="inputOccurredDate"
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={addBalanceChange}
              >
                Create
              </button>
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
