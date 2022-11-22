import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import axios from "axios";
import MaterialTable from "material-table";
import swal from "sweetalert";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";
import CreateCategoryModal from "../../../../components/Modals/Category/CreateCategoryModal";
import WebPageTitle from "../../../../components/WebPageTitle/WebPageTitle";
import EditCategoryModal from "../../../../components/Modals/Category/EditCategoryModal";

function CategoriesList() {
  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoryList] = useState([]);
  const [categoriesListChange, setCategoriesListChange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    axios.get(AppUrl.ShowCategories).then((response) => {
      if (response.data.status == 200) {
        setCategoryList(response.data.allCategories);
        console.log(response.data.allCategories);
      }
    });
    setLoading(false);
    if (categoriesListChange) {
      setCategoriesListChange(false);
    }
  }, [categoriesListChange]);

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const setEditModalStatus = (status) => {
    setShowEditModal(status);
  };

  const updateModalStatus = (status) => {
    setCategoriesListChange(status);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, width: "10%", align: "center" },
      {
        field: "name",
        title: "Name",
        width: "20%",
        validate: (rowData) => {
          if (rowData.name == "") {
            return "Name cannot be empty";
          }
          let categoryNames = [];
          let category_id = 0;
          categoriesList.forEach((category) => {
            category_id = category["id"];
            categoryNames[category_id] = category["name"];
          });
          let otherCategoryNames = categoryNames.filter(function (
            categoryName
          ) {
            //Return all values in array except the filtered object
            return categoryName !== categoryNames[rowData.id]; //Condition
          });
          //Check unique
          if (otherCategoryNames.includes(rowData.name)) {
            return "Name has already taken";
          }
          return true;
        },
      },
      {
        field: "description",
        title: "Description",
        emptyValue: () => <em>No description</em>,
      },
      {
        field: "price",
        title: "Price",
        width: "10%",
        align: "center",
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
        },
      },
    ];
    
    if(loading) {
      return <Loading/>
    }
    return (
      <Fragment>
        <WebPageTitle pageTitle="Room categories" />
        <div className="customDatatable">
          <div className="customDatatableHeader">
            <Button
              className="createBtn"
              style={{ backgroundColor: "white", color: "#1C4E80" }}
              onClick={(e) => setShowCreateModal(true)}
            >
              Add new category
            </Button>
            <CreateCategoryModal
              isShown={showCreateModal}
              setCreateModalStatus={setCreateModalStatus}
              updateModalStatus={updateModalStatus}
            />
          </div>
          <MaterialTable
            columns={columns}
            data={categoriesList}
            title={<span className="customDatatableTitle">All categories</span>}
            options={{
              searchAutoFocus: false,
              searchFieldVariant: "outlined",
              filtering: false,
              pageSizeOptions: [5, 10],
              paginationType: "stepped",
              exportButton: true,
              exportAllData: true,
              actionsColumnIndex: -1,
              headerStyle: {
                fontFamily: 'Anek Telugu, sans-serif',
              }
            }}
            actions={[
              {
                icon: "edit",
                tooltip: "Edit",
                onClick: (event, category) => {
                  setShowEditModal(true);
                  setSelectedCategoryId(category.id);
                },
              },
            ]}
            editable={{
              onRowDelete: (thisCategory) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const selectedCategory = [...details];
                    const index = thisCategory.tableData.id;
                    selectedCategory.splice(index, 1); //1: only one record
                    axios
                      .delete(AppUrl.DeleteCategory + thisCategory.id)
                      .then((response) => {
                        if (response.data.status == 200) {
                          swal("Success", response.data.message, "success");
                          setCategoriesListChange(true);
                        } else if (response.data.status == 404) {
                          swal("Error", response.data.message, "error");
                        } else if (response.data.status == 400) {
                          swal("Warning", response.data.message, "warning");
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </div>
        <EditCategoryModal
            isShown={showEditModal}
            categoryId={selectedCategoryId}
            setEditModalStatus={setEditModalStatus}
            updateModalStatus={updateModalStatus}
          />
      </Fragment>
    );
  }

export default CategoriesList;
