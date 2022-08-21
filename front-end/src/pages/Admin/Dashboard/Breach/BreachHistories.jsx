import React, { Fragment, useState, useEffect } from "react";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateBreachHistoryModal from "../../../../components/Modals/Breach/CreateBreachHistoryModal";
import BreachCount from "../../../../components/Charts/BreachCount";
import BreachRate from "../../../../components/Charts/BreachRate";

export default function BreachHistories() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breachHistories, setBreachHistories] = useState([]);
  const [breachHistoriesChange, setBreachHistoriesChange] = useState(false);
  const [renterBreachMadeTotal, setRenterBreachMadeTotal] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.GetRenterTotalNumberBreachMade).then((response) => {
      if (response.data.status === 200) {
        setRenterBreachMadeTotal(response.data.renterTotal);
        console.log(response.data.renterTotal);
      }
    });
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
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "breach_id",
        title: "Breach name",
        render: (rowData) => <p>{rowData.breach.name}</p>,
      },
      {
        field: "renter_id",
        title: "Renter",
        render: (rowData) => <p>{rowData.renter.name}</p>,
      },
      {
        field: "violate_at",
        title: "Violate at",
        render: rowData => moment(rowData.violate_at).format('hh:mm:ss - DD/MM/YYYY')
      },
    ];
  }

  var summarize_columns = [];
  if (loading) {
    return <Loading />;
  } else {
    summarize_columns = [
      {
        field: "renter_id",
        title: "Renter ID",
      },
      {
        field: "renter_name",
        title: "Renter name",
      },
      {
        field: "total",
        title: "Total breach made",
      },
    ];
  }

  return (
    <Fragment>
      <BreachCount/>
      <BreachRate/>
      <button 
      className="btn btn-primary" 
      onClick={(e) => setShowCreateModal(true)}
      >
        Add new breach history
      </button>
      <CreateBreachHistoryModal
        isShown={showCreateModal}
        setCreateModalStatus={setCreateModalStatus}
        updateCreateModalStatus={updateCreateModalStatus}
      />

      <MaterialTable
        columns={columns}
        data={breachHistories}
        title="Breach histories"
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
                      swal("Success", response.data.message, "success");
                      setBreachHistoriesChange(true);
                    } else if (response.data.status === 404) {
                      swal("Error", response.data.message, "error");
                    }
                  });
                resolve();
              }, 1000);
            }),
        }}
      />

      <MaterialTable
        columns={summarize_columns}
        data={renterBreachMadeTotal}
        title="Total breach made by renters"
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
        actions={[
          {
            icon: 'visibility',
            tooltip: 'Details',
            onClick: (event, renter_total) => 
            history.push(`/admin/view-renter-breach-details/${renter_total.renter_id}`),
          },
        ]}
      />
    </Fragment>
  );
}
