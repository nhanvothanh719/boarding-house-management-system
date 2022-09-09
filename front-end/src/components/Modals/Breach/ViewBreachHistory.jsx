import React, { Fragment, useState, useEffect } from "react";

import axios from "axios";
import moment from "moment";
import MaterialTable from "material-table";

import AppUrl from "../../../RestAPI/AppUrl";

export default function ViewBreachHistory(props) {
    const [breachHistoriesList, setBreachHistoriesList] = useState([]);

  useEffect(() => {
    if (props.isShown === true) {
      var model = new window.bootstrap.Modal(
        document.getElementById("addBreachModal")
      );
      model.show();
      axios.get(AppUrl.GetRenterBreachHistories + props.breachId).then((response) => {
        if (response.data.status === 200) {
          setBreachHistoriesList(response.data.breachHistories);
        }
      });
    }
  }, [props.isShown, props.breachId]);

  const closeModal = (e, value) => {
    props.setShowHistoriesModalStatus(false);
  };

  var columns = [];
    columns = [
      { title: "#", render: (rowData) => rowData.tableData.id + 1, align: "center" },
      {
        field: "violated_at",
        title: "Violate at",
        render: (rowData) =>
          moment(rowData.violated_at).format("hh:mm:ss - DD/MM/YYYY"),
      },
    ];

  return (
    <Fragment>
      <div
        class="modal fade"
        id="addBreachModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={closeModal}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="customModalTitle">View breach history details</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={closeModal}>
                  &times;
                </span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <MaterialTable
          columns={columns}
          data={breachHistoriesList}
          title=" "
          options={{
            pageSizeOptions: [5],
            paginationType: "stepped",
            actionsColumnIndex: -1,
          }}
        />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
