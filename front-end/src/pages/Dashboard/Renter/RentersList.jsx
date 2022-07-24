import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../../components/Loading";
import AppUrl from "../../../RestAPI/AppUrl";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import DefaultAvatar from "../../../assets/images/avatar.jpeg";

export default function RentersList() {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [rentersList, setRentersList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowRenters).then((response) => {
      if (response.data.status === 200) {
        setRentersList(response.data.allRenters);
      }
      setLoading(false);
    });
  }, []);

  var main_profile_columns = [];
  var sub_profile_columns = [];
  if (loading) {
    return <Loading />;
  } else {
    main_profile_columns = [
      { field: "id", title: "ID", align: "center", width: "5%" },
      { field: "profile_picture", title: "Avatar", export: false, width: "10%", render: rowData => <img src={DefaultAvatar} alt="avatar" style={{width: 40, borderRadius: '50%'}}/> },
      // { field: "profile_picture", title: "Avatar", export: false, width: "10%", render: rowData => <img src={rowData.profile_picture} alt="avatar" style={{width: 40, borderRadius: '50%'}}/> },
      { field: "name", title: "Name", width: "20%" },
      { field: "email", title: "Email", width: "20%" },
      { field: "gender", title: "Gender", lookup: { 0: "Female", 1: "Male" }, width: "10%" },
      { field: "phone_number", title: "Phone number" },
      {
        field: "is_locked",
        title: "Status",
        lookup: { 0: "Active", 1: "Locked" },
      },
    ];

    sub_profile_columns = [
      { field: "id", title: "ID", align: "center", width: "3%" },
      { field: "profile_picture", title: "Avatar", export: false, width: "7%", render: rowData => <img src={rowData.profile_picture} alt="avatar" style={{width: 40, borderRadius: '50%'}}/> },
      { field: "name", title: "Name", width: "15%" },
      { field: "date_of_birth", title: "Date of birth", type: "date", dateSetting: { locale: "en-GB" }, width: "15%" },
      { field: "id_card_number", title: "ID Card", width: "10%" },
      { field: "occupation", title: "Occupation", width: "10%" },
      { field: "permanent_address", title: "Permanent address" },
    ];
    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
            <Link to="/admin/create-renter" className="createBtn">
              Add new renter
            </Link>
          </div>
          <MaterialTable
            columns={main_profile_columns}
            data={rentersList}
            title="All renters"
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
                icon: () => <button className="btn btn-warning">Edit</button>,
                onClick: (event, renter) =>
                  history.push(`/admin/edit-renter/${renter.id}`),
              },
              {
                icon: () => <button className="btn btn-danger">Delete</button>,
                onClick: (event, renter) => console.log(),
              },
              {
                icon: () => <button className="btn btn-primary">Lock</button>,
                onClick: (event, renter) => console.log(),
              },
            ]}
          />

          <MaterialTable
            columns={sub_profile_columns}
            data={rentersList}
            title="Additional renters' profile"
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
          />
        </div>
      </Fragment>
    );
  }
}
