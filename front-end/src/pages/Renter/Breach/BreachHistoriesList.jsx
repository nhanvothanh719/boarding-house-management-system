import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import MaterialTable from "material-table";

import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../../components/Loading/Loading";
import WebPageTitle from "../../../components/WebPageTitle/WebPageTitle";
import { IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import RenterBreachCount from "../../../components/Charts/RenterCharts/RenterBreachCount";
import ViewBreachHistory from "../../../components/Modals/Breach/ViewBreachHistory";

export default function BreachHistoriesList() {
  const [breachesList, setBreachesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectBreachId, setSelectBreachId] = useState("");

  const severity = {
    1: "Serious",
    2: "Significant",
    3: "Normal",
    4: "Negligible",
  };
  const severityStyle = {
    1: "statusPassive",
    2: "statusPending",
    3: "statusOnGoing",
    4: "statusActive",
  };

  useEffect(() => {
    axios.get(AppUrl.GetAllRenterBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreachesList(response.data.renterBreachDetails);
        console.log(response.data.renterBreachDetails);
      }
    });
    setLoading(false);
  }, []);

  const setModalStatus = (status) => {
    setShowViewDetailsModal(status);
  };

  var breachesColumns = [];
  breachesColumns = [
    {
      title: "#",
      render: (rowData) => rowData.tableData.id + 1,
      width: "10%",
      align: "center",
    },
    {
      field: "name",
      title: "Name",
      width: "20%",
    },
    {
      field: "severity_level",
      title: "Severity level",
      width: "15%",
      lookup: {
        1: "Serious",
        2: "Significant",
        3: "Normal",
        4: "Negligible",
      },
      render: (rowData) => {
        return (
          <span className={`${severityStyle[rowData.severity_level]}`}>
            {severity[rowData.severity_level]}
          </span>
        );
      },
    },
    {
      field: "allowed_violate_number",
      title: "Allowed offenses number",
      width: "15%",
      type: "numeric",
    },
    {
      field: "total",
      title: "Total offenses number",
      render: (rowData) => {
        return rowData.allowed_violate_number - rowData.total <= 2 ? (
          <span style={{ color: "red" }}>{rowData.total}</span>
        ) : (
          <span>{rowData.total}</span>
        );
      },
    },
    {
      field: "description",
      title: "Description",
      render: (rowData) => (
        <Tooltip title="View description">
          <IconButton>
            <DescriptionIcon style={{ color: "black" }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Breaches" />
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <RenterBreachCount />
        </div>
        <MaterialTable
          columns={breachesColumns}
          data={breachesList}
          title={<span className="customDatatableTitle">All breaches</span>}
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
              fontFamily: "Anek Telugu, sans-serif",
            },
          }}
          actions={[
            (breach) => ({
              icon: "visibility",
              tooltip: "Details",
              onClick: (event, breach) => {
                setShowViewDetailsModal(true);
                setSelectBreachId(breach.id);
              },
              disabled: breach.total === 0,
            }),
          ]}
        />
      </div>
      <ViewBreachHistory
      isShown={showViewDetailsModal}
      breachId={selectBreachId}
      setModalStatus={setModalStatus}
      />
    </Fragment>
  );
}
