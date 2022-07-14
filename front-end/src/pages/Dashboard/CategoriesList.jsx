import axios from "axios";
import React, { Component, Fragment, useState, useEffect } from "react";
import Loading from "../../components/Loading";
import AppUrl from "../../RestAPI/AppUrl";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import MaterialTable from "material-table";

class CategoriesList extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      categoriesList: [],
      data: [],
    };
  }

  componentDidMount() {
    axios.get(AppUrl.ShowCategories).then((response) => {
      if (response.status === 200) {
        this.setState({ categoriesList: response.data.allCategories });
      }
      this.setState({ loading: false });
    });
  }

  render() {
    var columns = [];
    var actionColumn = [];
    var rows = [];
    if (this.state.loading) {
      return <Loading />;
    } else {
      columns = [
        { field: "id", title: "ID", align: "center" },
        { field: "name", title: "Name" },
        { field: "description", title: "Description", emptyValue:() => <em>No description</em> },
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
              data={this.state.categoriesList}
              title="All categories"
              options={{
                searchAutoFocus:false, 
                searchFieldVariant:"outlined",
                filtering:false,
                pageSizeOptions:[5, 10],
                paginationType:"stepped", 
                exportButton:true,
                exportAllData:true,
              }}
              actions = {[
                {
                  icon: () => <button className="btn btn-primary">Details</button>,
                  tooltip: "View details",
                  onClick:(e, data) => console.log(data)
                },
                {
                  icon: () => <button className="btn btn-danger">Delete</button>,
                  tooltip: "Delete",
                  onClick:(e, data) => console.log(data)
                }
              ]}
            />
          </div>
        </Fragment>
      );
    }
  }
}

// function CategoriesList() {
//   const [loading, setLoading] = useState(true);
//   const [categoryList, setCategoryList] = useState([]);

//   useEffect(() => {
//     axios.get(AppUrl.ShowCategories).then(response => {
//       if(response.status === 200)
//       {
//         setCategoryList(response.data.category);
//       }
//       setLoading(false);
//     });
//   }, []);

//   if(loading) {
//     return <Loading />
//   }

//   return(
//     <Fragment></Fragment>
//   )
// }

export default CategoriesList;
