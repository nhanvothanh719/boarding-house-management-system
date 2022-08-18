import React, { Fragment, useState, useEffect } from "react";
import { Link, } from "react-router-dom";

import axios from "axios";
import MaterialTable from "material-table";
import swal from "sweetalert";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

function CategoriesList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoryList] = useState([]);
  const [categoriesListChange, setCategoriesListChange] = useState(false);

  useEffect(() => {
    axios.get(AppUrl.ShowCategories).then((response) => {
      if (response.data.status === 200) {
        setCategoryList(response.data.allCategories);
      }
    });
    setLoading(false);
    if (categoriesListChange) {
      setCategoriesListChange(false);
    }
  }, [categoriesListChange]);

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      { field: "name", title: "Name",
      validate: (rowData) => {
        if (rowData.name === "") {
          return "Name cannot be empty";
        }
        let categoryNames = [];
        let category_id = 0;
        categoriesList.forEach((category) => {
          category_id = category["id"];
          categoryNames[category_id] = category["name"];
        });
        let otherCategoryNames = categoryNames.filter(function (categoryName) {
          //Return all values in array except the filtered object
          return categoryName !== categoryNames[rowData.id]; //Condition
        });
        //Check unique
        if (otherCategoryNames.includes(rowData.name)) {
          return "Name has already taken";
        }
        return true;
      }, },
      {
        field: "description",
        title: "Description",
        emptyValue: () => <em>No description</em>,
      },
      { field: "price", title: "Price", align: "center",
      type: "numeric",
      validate: (rowData) => {
        if (!Number.isFinite(rowData.price)) {
          return "Input must be float data type";
        } else if (rowData.allowed_violate_number <= 0) {
          return "Input number must be bigger than 0";
        } else if (rowData.allowed_violate_number >= 1000) {
          return "Input number must be smaller than 1000";
        }
        return true;
      }, },
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
            editable={{
              onRowUpdate: (newCategory, oldCategory) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const data = {
                      name: newCategory.name,
                      description: newCategory.description,
                      price: newCategory.price,
                    };
                    axios
                      .put(AppUrl.UpdateCategory + oldCategory.id, data)
                      .then((response) => {
                        if (response.data.status === 200) {
                          swal("Success", response.data.message, "success");
                          setCategoriesListChange(true);
                        } else if (response.data.status === 404) {
                          swal("Error", response.data.message, "error");
                        }
                      });
                    resolve();
                  }, 1000);
                }),
              onRowDelete: (thisCategory) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedCategory = [...details];
                    const index = thisCategory.tableData.id;
                    selectedCategory.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteCategory + thisCategory.id)
                      .then((response) => {
                        if (response.data.status === 200) {
                          swal("Success", response.data.message, "success");
                          setCategoriesListChange(true);
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

export default CategoriesList;
