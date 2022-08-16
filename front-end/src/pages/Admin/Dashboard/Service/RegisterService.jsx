import React, { Fragment, useEffect, useState } from "react";

import swal from "sweetalert";
import axios from "axios";
import MaterialTable from "material-table";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function RegisterService() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [input, setInput] = useState({
    user_id: "",
    service_id: "",
  });
  const [errors, setErrors] = useState([]);
  const [columnNumberChange, setColumnNumberChange] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.GetOptionalServices).then((response) => {
      if (response.data.status === 200) {
        setServices(response.data.allOptionalServices);
      }
    });
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

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const register = (e) => {
    e.preventDefault();
    const registration = {
      user_id: input.user_id,
      service_id: input.service_id,
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

  const findUser = (e) => {
    e.preventDefault();
    if (input.user_id) {
      axios
        .get(AppUrl.FindName + input.user_id)
        .then((response) => {
          if (response.data.status === 200) {
            swal("User found", response.data.name, "success");
          } else if (response.data.status === 404) {
            swal("No user found", response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
              <input
                type="text"
                className="inputItem"
                name="user_id"
                onChange={handleInput}
                value={input.user_id}
              />
            </div>
            <small className="text-danger">{errors.user_id}</small>
            <button onClick={findUser}>Find person</button>
            <div className="formInput">
              <label>Service:</label>
              <select
                className="form-control"
                name="service_id"
                onChange={handleInput}
                value={input.service_id}
              >
                <option selected>--- Select service ---</option>
                {services.map((service) => {
                  return (
                    <option value={service.id} key={service.id}>
                      {" "}
                      {service.name}{" "}
                    </option>
                  );
                })}
              </select>
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
