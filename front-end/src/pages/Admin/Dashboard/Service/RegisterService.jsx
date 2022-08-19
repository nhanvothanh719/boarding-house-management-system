import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import MaterialTable from "material-table";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import SearchService from "../../../../components/Search/SearchService";
import SearchRenter from "../../../../components/Search/SearchRenter";

export default function RegisterService() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [columnNumberChange, setColumnNumberChange] = useState(false);
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.ShowRegistrations).then((response) => {
      if (response.data.status === 200) {
        setRegistrations(response.data.allRegistrations);
      }
    });
    if (columnNumberChange) {
      setColumnNumberChange(false);
    }
    setLoading(false);
  }, [columnNumberChange]);

  const getSelectedService = (service) => {
    setSelectedService(service);
  }

  const getSelectedRenter = (renter) => {
    setSelectedRenter(renter);
  }

  const register = (e) => {
    e.preventDefault();
    const registration = {
      user_id: selectedRenter.id,
      service_id: selectedService.id,
    };
    axios
      .post(AppUrl.RegisterService, registration)
      .then((response) => {
        if (response.data.status === 200) {
          swal("Success", response.data.message, "success");
          setErrors([]);
          setColumnNumberChange(true);
        } else if (response.data.status === 422) {
          swal("All fields are mandatory", "", "error");
          setErrors(response.data.errors);
        } else if (response.data.status === 404) {
          swal("Error", response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { field: "id", title: "ID", align: "center" },
      {
        field: "user_id",
        title: "Renter",
        render: (rowData) => <p> {rowData.user.name} </p>,
      },
      {
        field: "service_id",
        title: "Service",
        render: (rowData) => <p> {rowData.service.name} </p>,
      },
    ];
  }

  const unregisterService = (e, id) => {
    e.preventDefault();
    const selectedRegistration = e.currentTarget;
    selectedRegistration.innerText = "Deleting";
    axios.delete(AppUrl.UnregisterService + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        //Delete table row
        selectedRegistration.closest("tr").remove();
        //setColumnNumberChange(true);
      } else if (response.data.status === 404) {
        swal("Fail", response.data.message, "error");
        selectedRegistration.innerText = "Delete";
      }
    });
  };

  return (
    <Fragment>
      <div className="topContainer">
        <h1>Register to use service</h1>
      </div>
      <div className="bottomContainer">
        <div className="bottomRightContainer">
          <form
            className="flexForm"
            onSubmit={register}
          >
            <div className="formInput">
              <label>Renter ID:</label>
              <SearchRenter getSelectedRenter={getSelectedRenter}/>
            </div>
            <small className="text-danger">{errors.user_id}</small>
            <div className="formInput">
              <label>Service:</label>
              <SearchService getSelectedService={getSelectedService}/>
            </div>
            <small className="text-danger">{errors.service_id}</small>
            <button type="submit" className="formButton">
              Register
            </button>
          </form>
          <div>
            <br /> <br /> <br />
            <MaterialTable
              columns={columns}
              data={registrations}
              title="All registrations"
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
                  icon: () => (
                    <button className="btn btn-danger">Unregister</button>
                  ),
                  onClick: (event, registration) =>
                    unregisterService(event, registration.id),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
