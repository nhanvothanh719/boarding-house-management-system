import React, { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import swal from "sweetalert";
import axios from "axios";
import MaterialTable from "material-table";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import AddRoomRentModal from "../../../../components/Modals/Room/AddRoomRentModal";

export default function RentRoom() {
  const [loading, setLoading] = useState(true);
  const [rentsList, setRentsLists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomRentsChange, setRoomRentsChange] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.GetAllRoomRents).then((response) => {
      if (response.data.status === 200) {
        setRentsLists(response.data.allRoomRents);
      }
    });
    if (roomRentsChange) {
      setRoomRentsChange(false);
    }
    setLoading(false);
  }, [roomRentsChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  let columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "id", title: "ID", align: "center" },
      {
        field: "room_id",
        title: "Room number",
        render: (rowData) => <p> {rowData.room.number} </p>,
      },
      {
        field: "renter_id",
        title: "Renter",
        render: (rowData) => <p> {rowData.renter.name} </p>,
      },
    ];
  }

  const cancelRent = (e, id) => {
    e.preventDefault();
    const selectedRentSection = e.currentTarget;
    selectedRentSection.innerText = "Deleting";
    axios.delete(AppUrl.CancelRentRoom + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        //Delete table row
        selectedRentSection.closest("tr").remove();
      } else if (response.data.status === 404) {
        swal("Fail", response.data.message, "error");
        selectedRentSection.innerText = "Delete";
      }
    });
  };

  return (
    <Fragment>
      <div className="customDatatable">
        <div className="customDatatableHeader">
          <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={(e) => setShowCreateModal(true)}
          >
            Create new room rent
          </Button>
          <AddRoomRentModal
          isShown={showCreateModal}
          setCreateModalStatus={setCreateModalStatus}
          updateCreateModalStatus={updateCreateModalStatus}
          />
        </div>
        <MaterialTable
          columns={columns}
          data={rentsList}
          title={<span className="customDatatableTitle">All room registrations</span>}
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
              icon: CancelPresentationIcon,
              tooltip: "Cancel",
              onClick: (event, registration) =>
                cancelRent(event, registration.id),
            },
          ]}
        />
      </div>
    </Fragment>
  );
}
