import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import SearchRenter from "../../../../components/Search/SearchRenter";
import EditSignaturesModal from "../../../../components/Modals/EditSignaturesModal";

export default function RoomContractsList() {
  const history = useHistory();

  const [details] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomContractsList, setRoomContractsList] = useState([]);
  const [contractRoomChange, setContractRoomChange] = useState(false);
  const [input, setInput] = useState({
    deposit_amount: "",
  });
  const [images, setImages] = useState({
    owner_signature: [],
    renter_signature: [],
  });
  const [effectiveFromDate, setEffectiveFromDate] = useState(moment());
  const [effectiveUntilDate, setEffectiveUntilDate] = useState(moment());
  const [selectedRenterId, setSelectedRenterId] = useState(null);
  const [showEditSignaturesModal, setShowEditSignaturesModal] = useState(false);
  const [selectedRoomContractId, setSelectedRoomContractId] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.ShowRoomContracts).then((response) => {
      if (response.status === 200) {
        setRoomContractsList(response.data.allRoomContracts);
      }
    });
    setLoading(false);
    if (contractRoomChange) {
      setContractRoomChange(false);
    }
  }, [contractRoomChange]);

  const showAddContractModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addRoomContractModal")
    );
    model.show();
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleImageInput = (e) => {
    e.persist();
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const getSelectedRenter = (renter) => {
    setSelectedRenterId(renter.id);
  }

  const setModalStatus = (status) => {
    setShowEditSignaturesModal(status);
  }

  const addRoomContract = (e) => {
    e.preventDefault();
    const roomContract = new FormData();
    roomContract.append("renter_id", selectedRenterId);
    roomContract.append("deposit_amount", input.deposit_amount);
    roomContract.append("owner_signature", images.owner_signature);
    roomContract.append("renter_signature", images.renter_signature);
    roomContract.append(
      "effective_from",
      moment(effectiveFromDate).utc().format("YYYY-MM-DD")
    );
    roomContract.append(
      "effective_until",
      moment(effectiveUntilDate).utc().format("YYYY-MM-DD")
    );
    axios
      .post(AppUrl.StoreRoomContract, roomContract)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          // Delete input after submit the form
          setInput({
            deposit_amount: "",
          });
          document.getElementById("inputRenterId").value = '';
          document.getElementById("inputRenterSignature").value = '';
          document.getElementById("inputOwnerSignature").value = '';
          setEffectiveFromDate(moment());
          setEffectiveUntilDate(moment());
          swal("Success", response.data.message, "success");
          setContractRoomChange(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            showAddContractModal();
          }, 1000);
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
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
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
      },
      {
        field: "deposit_amount",
        title: "Deposit amount",
      },
    ];
  }

  return (
    <Fragment>
      <MaterialTable
        columns={columns}
        data={roomContractsList}
        title="Room Contracts List"
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
          onRowUpdate: (newRoomContract, oldRoomContract) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const data = {
                  effective_until: moment(newRoomContract.effective_until).utc().format("YYYY-MM-DD"),
                  deposit_amount: newRoomContract.deposit_amount,
                };
                axios
                  .put(AppUrl.UpdateRoomContract + oldRoomContract.id, data)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setContractRoomChange(true);
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
                      setContractRoomChange(true);
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
            icon: 'visibility',
            tooltip: 'Details',
            onClick: (event, room_contract) => 
            history.push(`/admin/view-room-contract-details/${room_contract.id}`),
          },
          {
            icon: 'image',
            tooltip: 'Edit signatures',
            onClick: (event, room_contract) => {
              setShowEditSignaturesModal(true);
              setSelectedRoomContractId(room_contract.id);
            }
          },
        ]}
      />
      <button className="btn btn-primary" onClick={showAddContractModal}>
        Add new breach
      </button>

      <form
        class="modal fade"
        id="addRoomContractModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                Add new room contract
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
              <form className="flexForm" enctype="multipart/form-data">
                <SearchRenter getSelectedRenter = {getSelectedRenter}/>
                <small className="text-danger">{errors.renter_id}</small>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={["day", "month", "year"]}
                    label="Effective from"
                    value={effectiveFromDate}
                    onChange={(selectedDate) => {
                      setEffectiveFromDate(selectedDate);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} helperText={null} />
                    )}
                  />
                  <DatePicker
                    views={["day", "month", "year"]}
                    label="Effective until"
                    value={effectiveUntilDate}
                    onChange={(selectedDate) => {
                      setEffectiveUntilDate(selectedDate);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} helperText={null} />
                    )}
                  />
                </LocalizationProvider>
                <div className="formInput">
                  <label className="inputItemLabel">Deposit amount:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="deposit_amount"
                    onChange={handleInput}
                    value={input.deposit_amount}
                  />
                </div>
                <small className="text-danger">{errors.deposit_amount}</small>
                <div className="formInput form-group">
                  <label>Owner signature:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="owner_signature"
                    onChange={handleImageInput}
                    id="inputOwnerSignature"
                  />
                </div>
                <small className="text-danger">{errors.owner_signature}</small>

                <div className="formInput form-group">
                  <label>Renter signature:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="renter_signature"
                    onChange={handleImageInput}
                    id="inputRenterSignature"
                  />
                </div>
                <small className="text-danger">{errors.renter_signature}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={addRoomContract}
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
      </form>
      <EditSignaturesModal isShown = {showEditSignaturesModal} setModalStatus = {setModalStatus} roomContractId = {selectedRoomContractId}/>
    </Fragment>
  );
}
