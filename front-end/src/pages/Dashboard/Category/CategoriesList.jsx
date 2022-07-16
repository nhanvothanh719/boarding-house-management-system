import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../../components/Loading";
import AppUrl from "../../../RestAPI/AppUrl";
import MaterialTable from "material-table";
import swal from "sweetalert";

function CategoriesList() {
  const history = useHistory();

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

  const deleteCategory = (e, id) => {
    e.preventDefault();
    const selectedCategory = e.currentTarget;
    selectedCategory.innerText = "Deleting";
    axios.delete(`/delete-category/${id}`).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        //Delete table row
        selectedCategory.closest("tr").remove();
      } else if (response.data.status === 404) {
        swal("Success", response.data.message, "success");
        selectedCategory.innerText = "Delete";
      }
    });
  };

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
                onClick: (event, category) =>
                  history.push(`/admin/edit-category/${category.id}`),
              },
              {
                icon: () => <button className="btn btn-danger">Delete</button>,
                onClick: (event, category) =>
                  deleteCategory(event, category.id),
              },
            ]}
          />
        </div>
      </Fragment>
    );
  }
}

export default CategoriesList;
