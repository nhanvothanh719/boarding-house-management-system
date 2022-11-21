import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import BalanceVariation from "../../../../components/Charts/AdminCharts/BalanceVariation";
import BalanceCategoryRate from "../../../../components/Charts/AdminCharts/BalanceCategoryRate";
import AddBalanceChangeModal from "../../../../components/Modals/Balance/AddBalanceChangeModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";
import EditBalanceChangeModal from "../../../../components/Modals/Balance/EditBalanceChangeModal";

export default function BalanceDetails() {
  var currentDate = new Date();

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [balanceAmountChange, setBalanceAmountChange] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("");
  const [selectedBalanceChangeId, setSelectedBalanceChangeId] = useState(null);
  const isIncome = ["Expense", "Income"];
  const isIncomeStyle = ["expense", "earned"];

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

  const setEditModalStatus = (status) => {
    setShowEditModal(status);
  };

  const updateModalStatus = (status) => {
    setBalanceAmountChange(status);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "is_income",
        title: "Category",
        editable: "never",
        width: "20%",
        lookup: { 0: "Expenses", 1: "Earned" },
        render: rowData => (
          <div>
              <span className={`${isIncomeStyle[rowData.is_income]}` }>{isIncome[rowData.is_income]}</span>
          </div>
        )
      },
      {
        field: "description",
        title: "Description",
        validate: (rowData) =>
          rowData.description === ""
            ? { isValid: false, helperText: "Description cannot be empty" }
            : true,
      },
      {
        field: "amount",
        title: "Amount",
        type: "numeric",
        width: "15%",
        validate: (rowData) =>
          rowData.amount <= 0
            ? { isValid: false, helperText: "Amount must bigger than 0" }
            : true,
      },
      {
        field: "occurred_on",
        title: "Occurred on",
        type: "date",
        width: "20%",
        render: rowData => moment(rowData.occurred_on).format('DD/MM/YYYY'),
        validate: (rowData) =>
          rowData.occurred_on >= currentDate ||
          rowData.occurred_on <
            currentDate.setMonth(currentDate.getMonth() - 3)
            ? { isValid: false, helperText: "Inappropriate value" }
            : true,
      },
    ];

    if (loading) {
      return <Loading />;
    }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Balance details" />
      <h1 className="currentBalance center">
        Current Balance: $
        <span>{currentBalance}</span>
      </h1>
      {/* Line Chart */}
      <BalanceVariation isDataChange={balanceAmountChange}/>
      {/* Pie Chart */}
      <BalanceCategoryRate isDataChange={balanceAmountChange}/>
      {/* DataTable */}
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={(e) => setShowCreateModal(true)}
          >
            Add new change
          </Button>
          <AddBalanceChangeModal
              isShown={showCreateModal}
              setCreateModalStatus={setCreateModalStatus}
              updateModalStatus={updateModalStatus}
            />
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
          actions={[
            (balanceChange) => ({
              icon: "edit",
              tooltip: "Edit",
              onClick: (event, balanceChange) => {
                setShowEditModal(true);
                setSelectedBalanceChangeId(balanceChange.id);
              },
              disabled: moment(balanceChange.occurred_on).add(3, "M") <= moment()
            }),
          ]}
          editable={{
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
      <EditBalanceChangeModal
      isShown={showEditModal}
      balanceChangeId={selectedBalanceChangeId}
      setEditModalStatus={setEditModalStatus}
      updateModalStatus={updateModalStatus}
      />
    </Fragment>
  );
}
