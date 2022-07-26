import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../../components/Loading";
import AppUrl from "../../../RestAPI/AppUrl";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

export default function MotorbikesList() {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [motorbikesList, setMotorbikesList] = useState([]);
  const [motorbikeOwners, setOwners] = useState([]);
  useEffect(() => {
    axios.get(AppUrl.ShowMotorbikes).then((response) => {
      if (response.status === 200) {
        setMotorbikesList(response.data.allMotorbikes);
      }
      setLoading(false);
    });
    axios.get(AppUrl.GetAllMotorbikeOwners).then((response) => {
      if (response.status === 200) {
        setOwners(response.data.allOwners);
      }
    });
  }, []);

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {

    const names = [];
    let owner_id = 0;
    motorbikeOwners.forEach(owner => {
      owner_id = owner['id'];
      names[owner_id] = owner['name'];
    });

    columns = [
      { field: "id", title: "ID", align: "center" },
      { field: "license_plate", title: "License plate" },
      { field: "motorbike_image", title: "Image", export: false, render: rowData => <img src={rowData} alt="motorbike_image" style={{width: 40, borderRadius: '50%'}}/> },
      { field: "user_id", title: "Owner", render: rowData => <p> {names[rowData.user_id]} </p> },
    ];

    const deleteMotorbike = (e, id) => {
      e.preventDefault();
      const selectedMotorbike = e.currentTarget;
      selectedMotorbike.innerText = "Deleting";
      axios.delete(AppUrl.DeleteMotorbike + id).then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          //Delete table row
          selectedMotorbike.closest("tr").remove();
          history.push('/admin/view-all-motorbikes');
        } else if (response.data.status === 404) {
          swal("Fail", response.data.message, "error");
          selectedMotorbike.innerText = "Delete";
        }
      });
    };

    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
            <Link to="/admin/create-motorbike" className="createBtn">
              Add new motorbike
            </Link>
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
                icon: () => <button className="btn btn-warning">Edit</button>,
                onClick: (event, motorbike) =>
                  history.push(`/admin/edit-motorbike/${motorbike.id}`),
              },
              {
                icon: () => <button className="btn btn-danger">Delete</button>,
                onClick: (event, motorbike) => 
                deleteMotorbike(event, motorbike.id),
              },
            ]}
          />
        </div>
      </Fragment>
    );
  }
}
