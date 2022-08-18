import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function ServicesList() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState([]);
  const [servicesListChange, setServicesListChange] = useState([]);

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

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      { field: "name", title: "Name" },
      {
        field: "description",
        title: "Description",
        emptyValue: () => <em>No description</em>,
      },
      { field: "unit", title: "Unit" },
      { field: "unit_price", title: "Price per unit" },
      {
        field: "is_compulsory",
        title: "Compulsory",
        lookup: { 0: "No", 1: "Yes" },
      },
    ];

    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
            <Link to="/admin/create-service" className="createBtn">
              Add new service
            </Link>
            <br />
            <Link to="/admin/register-service" className="createBtn">
              Register for using service
            </Link>
          </div>
          <MaterialTable
            columns={columns}
            data={servicesList}
            title="All categories"
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
                icon: 'edit',
                tooltip: 'Edit',
                onClick: (event, service) =>
                  history.push(`/admin/edit-service/${service.id}`),
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
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </div>
      </Fragment>
    );
  }
}
