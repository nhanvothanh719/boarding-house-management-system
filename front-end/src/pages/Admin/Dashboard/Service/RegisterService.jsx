import React, { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import swal from "sweetalert";
import axios from "axios";
import MaterialTable from "material-table";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import RegisterServiceModal from "../../../../components/Modals/Service/RegisterServiceModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";
import DefaultAvatar from "../../../../assets/images/default_avatar.png";

export default function RegisterService() {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [registeredServicesChange, setRegisteredServicesChange] =
    useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.ShowRegistrations).then((response) => {
      if (response.data.status === 200) {
        setRegistrations(response.data.allRegistrations);
      }
    });
    if (registeredServicesChange) {
      setRegisteredServicesChange(false);
    }
    setLoading(false);
  }, [registeredServicesChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateModalStatus = (status) => {
    setRegisteredServicesChange(status);
  };

  let columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "user_id",
        title: "Renter",
        align: "left",
        render: (rowData) => {
          return (
            <span>
              <img
                src={
                  rowData.user.profile_picture !== null
                    ? `http://127.0.0.1:8000/${rowData.user.profile_picture}`
                    : DefaultAvatar
                }
                alt="avatar"
                className="topAvatar"
              />
              <p style={{ display: "inline" }}> {rowData.user.name} </p>
            </span>
          );
        },
      },
      {
        field: "service_id",
        title: "Service",
        render: (rowData) => <p> {rowData.service.name} </p>,
      },
    ];

  const unregisterService = (e, id) => {
    e.preventDefault();
    const selectedRegistration = e.currentTarget;
    selectedRegistration.innerText = "Deleting";
    axios.delete(AppUrl.UnregisterService + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        //Delete table row
        selectedRegistration.closest("tr").remove();
        //setColumnNumberChange(true);
      } else if (response.data.status === 404) {
        swal("Fail", response.data.message, "error");
        selectedRegistration.innerText = "Delete";
      }
    });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Service registrations" />
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={(e) => setShowCreateModal(true)}
          >
            Create new service registration
          </Button>
          <RegisterServiceModal
            isShown={showCreateModal}
            setCreateModalStatus={setCreateModalStatus}
            updateModalStatus={updateModalStatus}
          />
        </div>
        <MaterialTable
          columns={columns}
          data={registrations}
          title={
            <span className="customDatatableTitle">
              All service registrations
            </span>
          }
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
            {
              icon: CancelPresentationIcon,
              tooltip: "Unregister",
              onClick: (event, registration) =>
                unregisterService(event, registration.id),
            },
          ]}
        />
      </div>
    </Fragment>
  );
}
