import React, { Fragment, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import axios from "axios";
import MaterialTable from "material-table";
import swal from "sweetalert";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

function CategoriesList() {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoryList] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowCategories).then((response) => {
      if (response.data.status === 200) {
        setCategoryList(response.data.allCategories);
      }
      setLoading(false);
    });
  }, []);

  const deleteCategory = (e, id) => {
    e.preventDefault();
    const selectedCategory = e.currentTarget;
    selectedCategory.innerText = "Deleting";
    axios.delete(AppUrl.DeleteCategory + id).then((response) => {
      if (response.data.status === 200) {
        swal("Success", response.data.message, "success");
        //Delete table row
        selectedCategory.closest("tr").remove();
        history.push('/admin/view-all-categories');
      } else if (response.data.status === 404) {
        swal("Fail", response.data.message, "error");
        selectedCategory.innerText = "Delete";
      }
    });
  };

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
                icon: 'edit',
                tooltip: 'Edit',
                onClick: (event, category) =>
                  history.push(`/admin/edit-category/${category.id}`),
              },
              {
                icon: 'delete',
                tooltip: 'Delete',
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
