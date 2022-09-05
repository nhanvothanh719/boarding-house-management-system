import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import EditSignaturesModal from "../../../../components/Modals/RoomContract/EditSignaturesModal";
import CreateRoomContractModal from "../../../../components/Modals/RoomContract/CreateRoomContractModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";

export default function RoomContractsList() {
  const history = useHistory();
  var currentDate = new Date();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomContractsList, setRoomContractsList] = useState([]);
  const [roomContractsListChange, setRoomContractsListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditSignaturesModal, setShowEditSignaturesModal] = useState(false);
  const [selectedRoomContractId, setSelectedRoomContractId] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.ShowRoomContracts).then((response) => {
      if (response.status === 200) {
        setRoomContractsList(response.data.allRoomContracts);
      }
    });
    setLoading(false);
    if (roomContractsListChange) {
      setRoomContractsListChange(false);
    }
  }, [roomContractsListChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const setEditModalStatus = (status) => {
    setShowEditSignaturesModal(status);
  };

  const updateModalStatus = (status) => {
    setRoomContractsListChange(status);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "renter_id",
        title: "Renter name",
        editable: "never",
        render: (rowData) => <p>{rowData.renter.name}</p>,
      },
      {
        field: "effective_from",
        title: "Effective from",
        editable: "never",
        type: "date",
        render: (rowData) =>
          moment(rowData.effective_from).format("DD/MM/YYYY"),
      },
      {
        field: "effective_until",
        title: "Effective until",
        type: "date",
        render: (rowData) =>
          moment(rowData.effective_until).format("DD/MM/YYYY"),
        validate: (rowData) =>
          rowData.effective_until <= currentDate
            ? { isValid: false, helperText: "Inappropriate value" }
            : true,
      },
      {
        field: "deposit_amount",
        title: "Deposit amount",
      },
    ];

    if (loading) {
      return <Loading />;
    }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Room contracts" />
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={(e) => setShowCreateModal(true)}
          >
            Add new room contract
          </Button>
        </div>
        <MaterialTable
          columns={columns}
          data={roomContractsList}
          title={<span className="customDatatableTitle">All Room Contracts</span>}
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
            onRowUpdate: (newRoomContract, oldRoomContract) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const data = {
                    effective_until: moment(newRoomContract.effective_until)
                      .utc()
                      .format("YYYY-MM-DD"),
                    deposit_amount: newRoomContract.deposit_amount,
                  };
                  axios
                    .put(AppUrl.UpdateRoomContract + oldRoomContract.id, data)
                    .then((response) => {
                      if (response.data.status === 200) {
                        swal("Success", response.data.message, "success");
                        roomContractsListChange(true);
                      } else if (response.data.status === 404) {
                        swal("Error", response.data.message, "error");
                      }
                    });
                  resolve();
                }, 1000);
              }),
            onRowDelete: (thisRoomContract) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const selectedRoomContract = [...details];
                  const index = thisRoomContract.tableData.id;
                  selectedRoomContract.splice(index, 1); //1: only one record
                  axios
                    .delete(AppUrl.DeleteRoomContract + thisRoomContract.id)
                    .then((response) => {
                      if (response.data.status === 200) {
                        swal("Success", response.data.message, "success");
                        roomContractsListChange(true);
                      } else if (response.data.status === 404) {
                        swal("Error", response.data.message, "error");
                      }
                    });
                  resolve();
                }, 1000);
              }),
          }}
          actions={[
            {
              icon: "visibility",
              tooltip: "Details",
              onClick: (event, room_contract) =>
                history.push(
                  `/admin/view-room-contract-details/${room_contract.id}`
                ),
            },
            {
              icon: "image",
              tooltip: "Edit signatures",
              onClick: (event, room_contract) => {
                setShowEditSignaturesModal(true);
                setSelectedRoomContractId(room_contract.id);
              },
            },
          ]}
        />
        <CreateRoomContractModal
          isShown={showCreateModal}
          setCreateModalStatus={setCreateModalStatus}
          updateModalStatus={updateModalStatus}
        />
        <EditSignaturesModal
          isShown={showEditSignaturesModal}
          roomContractId={selectedRoomContractId}
          setEditModalStatus={setEditModalStatus}
          updateModalStatus={updateModalStatus}
        />
      </div>
    </Fragment>
  );
}
