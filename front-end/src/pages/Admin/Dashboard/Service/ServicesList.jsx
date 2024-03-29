import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateServiceModal from "../../../../components/Modals/Service/CreateServiceModal";
import EditServiceModal from "../../../../components/Modals/Service/EditServiceModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function ServicesList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState([]);
  const [servicesListChange, setServicesListChange] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const isCompulsory = ["Optional", "Compulsory"];
  const isCompulsoryStyle = ["statusActive", "statusPassive"];

  useEffect(() => {
    axios.get(AppUrl.ShowServices).then((response) => {
      if (response.data.status === 200) {
        setServicesList(response.data.allServices);
      }
    });
    setLoading(false);
    if (servicesListChange) {
      setServicesListChange(false);
    }
  }, [servicesListChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const setEditModalStatus = (status) => {
    setShowEditModal(status);
  };

  const updateModalStatus = (status) => {
    setServicesListChange(status);
  };

  var columns = [];
  columns = [
    {
      title: "#",
      render: (rowData) => rowData.tableData.id + 1,
      width: "10%",
      align: "center",
    },
    { field: "name", title: "Name" },
    { field: "unit", title: "Unit" },
    { field: "unit_price", title: "Price per unit" },
    {
      field: "is_compulsory",
      title: "Category",
      lookup: { 0: "Optional", 1: "Compulsory" },
      render: (rowData) => (
        <div>
          <span
            className={`${isCompulsoryStyle[rowData.is_compulsory]}`}>
            {isCompulsory[rowData.is_compulsory]}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Services" />
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={(e) => setShowCreateModal(true)}
          >
            Add new service
          </Button>
          <CreateServiceModal
            isShown={showCreateModal}
            setCreateModalStatus={setCreateModalStatus}
            updateModalStatus={updateModalStatus}
          />
        </div>
        <MaterialTable
          columns={columns}
          data={servicesList}
          title={<span className="customDatatableTitle">All services</span>}
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
              icon: "edit",
              tooltip: "Edit",
              onClick: (event, service) => {
                setShowEditModal(true);
                setSelectedServiceId(service.id);
              },
            },
          ]}
          editable={{
            onRowDelete: (thisService) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const selectedService = [...details];
                  const index = thisService.tableData.id;
                  selectedService.splice(index, 1); //1: only one record
                  axios
                    .delete(AppUrl.DeleteService + thisService.id)
                    .then((response) => {
                      if (response.data.status === 200) {
                        swal("Success", response.data.message, "success");
                        setServicesListChange(true);
                      } else if (response.data.status === 404) {
                        swal("Error", response.data.message, "error");
                      } else if (response.data.status === 400) {
                        swal("Warning", response.data.message, "warning");
                      }
                    });
                  resolve();
                }, 1000);
              }),
          }}
        />
      </div>
      <EditServiceModal
        isShown={showEditModal}
        serviceId={selectedServiceId}
        setEditModalStatus={setEditModalStatus}
        updateModalStatus={updateModalStatus}
      />
    </Fragment>
  );
}
