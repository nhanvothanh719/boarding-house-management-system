import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import ConfirmLoading from "../../../../components/Loading/ConfirmLoading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateAnnouncementModal from "../../../../components/Modals/Announcement/CreateAnnouncementModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";
import DefaultAvatar from "../../../../assets/images/default_avatar.png";

export default function CreateAnnouncement() {
  const [loading, setLoading] = useState(true);
  const [loaderClass, setLoaderClass] = useState('d-none');
  const [displayComponentsClass, setDisplayComponentsClass] = useState('');
  const [rentersList, setRentersList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rentersIdList, setRentersIdList] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.ShowRenters).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allRenters);
      }
      setLoading(false);
    });
  }, []);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const createAnnouncement = (e) => {
    e.preventDefault();
    let renters_id = [];
    if (selectedRows.length < 1) {
      swal("Error", "Cannot send due to no renter selected", "error");
    }
    else if (selectedRows.length > 5) {
      swal("Error", "The maximum number of renters selected is 5", "error");
    }
    else {
      selectedRows.map((row) => {
        return renters_id.push(row.id);
      });
      setRentersIdList(renters_id);
      setShowCreateModal(true);
    }
  };

  var columns = [];
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "profile_picture",
        title: "Avatar",
        export: false,
        width: "7%",
        render: (rowData) => (
          <img
            src={
              rowData.profile_picture !== null ? `http://127.0.0.1:8000/${rowData.profile_picture}` : DefaultAvatar
            }
            alt="avatar"
            className="topAvatar"
          />
        ),
      },
      { field: "name", title: "Name", width: "20%" },
      { field: "email", title: "Email", width: "20%" },
      { field: "phone_number", title: "Phone number", width: "20%" },
    ];

    if (loading) {
      return <Loading />;
    }
  return (
    <Fragment>
      <WebPageTitle pageTitle="Annoucements" />
      <div className={loaderClass}><ConfirmLoading/></div>
      <div className={displayComponentsClass}>
      <div className="customDatatable">
        <div className="customDatatableHeader">
        <Button
            className="createBtn"
            style={{ backgroundColor: "white", color: "#1C4E80" }}
            onClick={createAnnouncement}
          >
            Create new announcement
            </Button>
            <CreateAnnouncementModal 
            isShown={showCreateModal}
            setLoaderClass={setLoaderClass}
            setDisplayComponentsClass={setDisplayComponentsClass}
            rentersIdList={rentersIdList}
            setCreateModalStatus={setCreateModalStatus}
            />
        </div>
        <MaterialTable
        columns={columns}
        data={rentersList}
        title={<span className="customDatatableTitle">Select renters to send announcement</span>}
        onSelectionChange={(rows) => setSelectedRows(rows)}
        options={{
          searchAutoFocus: false,
          searchFieldVariant: "outlined",
          filtering: false,
          pageSizeOptions: [5, 10],
          paginationType: "stepped",
          exportButton: false,
          exportAllData: true,
          actionsColumnIndex: -1,
          selection: true,
          headerStyle: {
            fontFamily: 'Anek Telugu, sans-serif',
          }
        }}
      />
        </div>
      </div>
    </Fragment>
  );
}
