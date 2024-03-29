import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";


import Loading from "../../../../components/Loading/Loading";
import ConfirmLoading from "../../../../components/Loading/ConfirmLoading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateBreachHistoryModal from "../../../../components/Modals/Breach/CreateBreachHistoryModal";
import BreachCount from "../../../../components/Charts/AdminCharts/BreachCount";
import BreachRate from "../../../../components/Charts/AdminCharts/BreachRate";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function BreachHistories() {

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderClass, setLoaderClass] = useState("d-none");
  const [displayComponentsClass, setDisplayComponentsClass] = useState("");
  const [breachHistories, setBreachHistories] = useState([]);
  const [breachHistoriesChange, setBreachHistoriesChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.ShowBreachHistories).then((response) => {
      if (response.data.status === 200) {
        setBreachHistories(response.data.allBreachHistories);
      }
    });
    if (breachHistoriesChange) {
      setBreachHistoriesChange(false);
    }
    setLoading(false);
  }, [breachHistoriesChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateCreateModalStatus = (status) => {
    setBreachHistoriesChange(status);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "breach_id",
        title: "Breach name",
        render: (rowData) => <p>{rowData.breach.name}</p>,
      },
      {
        field: "renter_id",
        title: "Renter",
        render: (rowData) => <Link className="customDashboardLink" to={`/admin/view-renter-breach-details/${rowData.renter_id}`}>{rowData.renter.name}</Link>,
      },
      {
        field: "violated_at",
        title: "Violate at",
        render: rowData => moment(rowData.violated_at).format('hh:mm:ss - DD/MM/YYYY')
      },
    ];

    if (loading) {
      return <Loading />;
    }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Breach histories" />
      <div className={loaderClass}>
        <ConfirmLoading />
      </div>
      <div className={displayComponentsClass}>
      <BreachCount isDataChange={breachHistoriesChange}/>
      <BreachRate isDataChange={breachHistoriesChange}/>
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={(e) => setShowCreateModal(true)}
          >
            Create new breach history
          </Button>
          <CreateBreachHistoryModal
        isShown={showCreateModal}
        setLoaderClass={setLoaderClass}
        setDisplayComponentsClass={setDisplayComponentsClass}
        setCreateModalStatus={setCreateModalStatus}
        updateCreateModalStatus={updateCreateModalStatus}
      />
        </div>
      <MaterialTable
        columns={columns}
        data={breachHistories}
        title={<span className="customDatatableTitle">All breach histories</span>}
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
          onRowDelete: (oldBreachHistory) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const selectBreachHistory = [...details];
                const index = oldBreachHistory.tableData.id;
                selectBreachHistory.splice(index, 1); //1: only one record
                axios
                  .delete(AppUrl.DeleteBreachHistory + oldBreachHistory.id)
                  .then((response) => {
                    if (response.data.status === 200) {
                      
                      setBreachHistoriesChange(true);
                      swal("Success", response.data.message, "success");
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
      </div>
    </Fragment>
  );
}
