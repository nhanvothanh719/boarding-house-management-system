import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateMotorbikeModal from "../../../../components/Modals/Motorbike/CreateMotorbikeModal";
import EditMotorbikeModal from "../../../../components/Modals/Motorbike/EditMotorbikeModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";
import DefaultMotorbikeImg from "../../../../assets/images/default_motorbike.jpeg";
import ViewMotorbikeImageModal from "../../../../components/Modals/Motorbike/ViewMotorbikeImageModal";

export default function MotorbikesList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motorbikesList, setMotorbikesList] = useState([]);
  const [motorbikesListChange, setMotorbikesListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewImageModal, setShowViewImageModal] = useState(false);
  const [selectedMotorbikeId, setSelectedMotorbikeId] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.ShowMotorbikes).then((response) => {
      if (response.status === 200) {
        setMotorbikesList(response.data.allMotorbikes);
      }
    });
    setLoading(false);
    if (motorbikesListChange) {
      setMotorbikesListChange(false);
    }
  }, [motorbikesListChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const setEditModalStatus = (status) => {
    setShowEditModal(status);
  };

  const setViewImageModalStatus = (status) => {
    setShowViewImageModal(status);
  }

  const updateModalStatus = (status) => {
    setMotorbikesListChange(status);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      { 
        field: "license_plate", 
        title: "License plate",
        render: (rowData) => <span className="licensePlate"> {rowData.license_plate} </span>
     },
      {
        field: "motorbike_image",
        title: "Image",
        export: false,
        render: (rowData) => (
          <img
          src={
            rowData.motorbike_image !== null ? `http://127.0.0.1:8000/${rowData.motorbike_image}` : DefaultMotorbikeImg
          }
            alt="motorbike_image"
            className="topAvatar"
            onMouseEnter={() => {
              setShowViewImageModal(true);
              setSelectedMotorbikeId(rowData.id);
            }}
          />
        ),
      },
      {
        field: "renter_id",
        title: "Owner",
        render: (rowData) => <p> {rowData.renter.name} </p>,
      },
    ];

    if (loading) {
      return <Loading />;
    }
    return (
      <Fragment>
        <WebPageTitle pageTitle="Motorbikes" />
        <div className="customDatatable">
          <div className="customDatatableHeader">
          <Button
              className="createBtn"
              style={{ backgroundColor: "white", color: "#1C4E80" }}
              onClick={(e) => setShowCreateModal(true)}
            >
              Add new motorbike
            </Button>
            <CreateMotorbikeModal
              isShown={showCreateModal}
              setCreateModalStatus={setCreateModalStatus}
              updateModalStatus={updateModalStatus}
            />
          </div>
          <MaterialTable
            columns={columns}
            data={motorbikesList}
            title={<span className="customDatatableTitle">All motorbikes</span>}
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
              {
                icon: "edit",
                tooltip: "Edit",
                onClick: (event, motorbike) => {
                  setShowEditModal(true);
                  setSelectedMotorbikeId(motorbike.id);
                },
              },
            ]}
            editable={{
              onRowDelete: (thisMotorbike) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedMotorbike = [...details];
                    const index = thisMotorbike.tableData.id;
                    selectedMotorbike.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteMotorbike + thisMotorbike.id)
                      .then((response) => {
                        if (response.data.status === 200) {
                          swal("Success", response.data.message, "success");
                          setMotorbikesListChange(true);
                        } else if (response.data.status === 404) {
                          swal("Error", response.data.message, "error");
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
          <EditMotorbikeModal
            isShown={showEditModal}
            motorbikeId={selectedMotorbikeId}
            setEditModalStatus={setEditModalStatus}
            updateModalStatus={updateModalStatus}
          />
          <ViewMotorbikeImageModal
          isShown={showViewImageModal}
          motorbikeId={selectedMotorbikeId}
          setViewImageModalStatus={setViewImageModalStatus}
          />
        </div>
      </Fragment>
    );
  }
