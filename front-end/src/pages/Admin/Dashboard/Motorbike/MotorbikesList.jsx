import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateMotorbikeModal from "../../../../components/Modals/Motorbike/CreateMotorbikeModal";
import EditMotorbikeModal from "../../../../components/Modals/Motorbike/EditMotorbikeModal";

export default function MotorbikesList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motorbikesList, setMotorbikesList] = useState([]);
  const [motorbikesListChange, setMotorbikesListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const updateModalStatus = (status) => {
    setMotorbikesListChange(status);
  };

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1 },
      { field: "license_plate", title: "License plate" },
      {
        field: "motorbike_image",
        title: "Image",
        export: false,
        render: (rowData) => (
          <img
            src={rowData}
            alt="motorbike_image"
            style={{ width: 40, borderRadius: "50%" }}
          />
        ),
      },
      {
        field: "renter_id",
        title: "Owner",
        render: (rowData) => <p> {rowData.renter.name} </p>,
      },
    ];

    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
            <button
              className="btn btn-primary"
              onClick={(e) => setShowCreateModal(true)}
            >
              Add new motorbike
            </button>
            <CreateMotorbikeModal
              isShown={showCreateModal}
              setCreateModalStatus={setCreateModalStatus}
              updateModalStatus={updateModalStatus}
            />
          </div>
          <MaterialTable
            columns={columns}
            data={motorbikesList}
            title="All motorbikes"
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
        </div>
      </Fragment>
    );
  }
}
