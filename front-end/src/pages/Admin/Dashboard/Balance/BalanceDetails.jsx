import React, { Fragment, useState, useEffect } from "react";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Pie,
  PieChart,
  Cell,
} from "recharts";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function BalanceDetails() {
  let currentDate = new Date();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [balanceChanges, setBalanceChanges] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
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
        setBalanceChanges(response.data.recentBalanceChanges);
        setCurrentBalance(response.data.currentBalance);
      }
    });
    axios.get(AppUrl.GetPieChartData).then((response) => {
      if (response.data.status === 200) {
        setPieChartData(response.data.pieData);
        //console.log(response.data.pieData);
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
      { field: "id", title: "ID", align: "center", editable: "never" },
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

  //For Pie Chart
  const COLORS = ["#8884d8", "#82ca9d"];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{`${payload[0].name} - Total: ${payload[0].value.toFixed(
            2
          )}`}</label>
        </div>
      );
    }
    return null;
  };
  //

  return (
    <Fragment>
      <div>Balance Details</div>
      <h1>
        Current Balance:
        {currentBalance}
      </h1>
      {/* Line Chart */}
      <LineChart
        width={730}
        height={250}
        data={balanceChanges}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="occurred_on" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      </LineChart>
      {/* Pie Chart */}
      <PieChart width={730} height={300}>
        <Pie
          data={pieChartData}
          color="#000000"
          dataKey="total"
          nameKey="description"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
        >
          {balanceChanges.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
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
          onRowDelete: (oldBalanceChange) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const selectBalanceChange = [...details];
                const index = oldBalanceChange.tableData.id;
                selectBalanceChange.splice(index, 1); //1: only one record
                axios
                  .delete(AppUrl.DeleteBalanceChange + oldBalanceChange.id)
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