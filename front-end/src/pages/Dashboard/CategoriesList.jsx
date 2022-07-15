import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import Loading from "../../components/Loading";
import AppUrl from "../../RestAPI/AppUrl";
import { Link, Redirect } from "react-router-dom";
import MaterialTable from "material-table";

function CategoriesList() {
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoryList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowCategories).then((response) => {
      if (response.status === 200) {
        setCategoryList(response.data.allCategories);
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
      { field: "name", title: "Name" },
      {
        field: "description",
        title: "Description",
        emptyValue: () => <em>No description</em>,
      },
      { field: "price", title: "Price", align: "center" },
    ];

    return (
      <Fragment>
        <div className="customDatatable">
          <div className="datatableHeader">
            <Link to="/admin/create-category" className="createBtn">
              Add new category
            </Link>
          </div>
          <MaterialTable
            columns={columns}
            data={categoriesList}
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
                icon: () => <button className="btn btn-warning">Edit</button>,
                onClick: (event, data) => (
                  <Redirect to={`/admin/edit-category/${data.id}`}></Redirect>
                ),
              },
              {
                icon: () => <button className="btn btn-danger">Delete</button>,
                onClick: (event, data) => console.log(data),
              },
            ]}
          />
        </div>
      </Fragment>
    );
  }
}

export default CategoriesList;
