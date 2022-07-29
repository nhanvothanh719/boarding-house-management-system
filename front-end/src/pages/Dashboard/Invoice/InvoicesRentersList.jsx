import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../../components/Loading";
import AppUrl from "../../../RestAPI/AppUrl";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

export default function InvoicesRentersList() {
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
  
    var columns = [];
  
    if (loading) {
      return <Loading />;
    } else {
      columns = [
        { field: "id", title: "ID", align: "center" },
        {
          field: "profile_picture",
          title: "Avatar",
          render: (rowData) => (
            <img
              src={rowData.profile_picture}
              alt="avatar"
              style={{ width: 40, borderRadius: "50%" }}
            />
          ),
        },
        { field: "name", title: "Name" },
        { field: "email", title: "Email" },
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
              columns={columns}
              data={rentersList}
              title="All renters"
              options={{
                searchAutoFocus: false,
                searchFieldVariant: "outlined",
                filtering: false,
                pageSizeOptions: [5, 10],
                paginationType: "stepped",
                actionsColumnIndex: -1,
              }}
              actions={[
                {
                  icon: () => (
                    <button className="btn btn-primary">All invoices</button>
                  ),
                  onClick: (event, renter) => console.log(),
                },
                {
                  icon: () => <button className="btn btn-success">Create</button>,
                  onClick: (event, renter) => history.push(`/admin/create-invoice/${renter.id}`),
                },
              ]}
            />
          </div>
        </Fragment>
      );
    }
}
