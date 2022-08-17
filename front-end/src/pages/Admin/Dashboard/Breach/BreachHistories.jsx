import React, { Fragment, useState, useEffect } from "react";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  LabelList,
  Pie,
  PieChart,
  Sector
} from "recharts";

import Loading from "../../../../components/Loading/Loading";
import AppUrl from "../../../../RestAPI/AppUrl";

export default function BreachHistories() {
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breachHistories, setBreachHistories] = useState([]);
  const [input, setInput] = useState({
    breach_id: "",
    renter_id: "",
  });
  const [details] = useState([]);
  const [breachHistoriesChange, setBreachHistoriesChange] = useState(false);
  const [breachesList, setBreachesList] = useState([]);
  const [violateMoment, setViolateMoment] = useState(moment());
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [renterBreachMadeTotal, setRenterBreachMadeTotal] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.ShowBreaches).then((response) => {
      if (response.data.status === 200) {
        setBreachesList(response.data.allBreaches);
      }
    });
    axios.get(AppUrl.GetTotalNumberBreachMade).then((response) => {
      if (response.data.status === 200) {
        setChartData(response.data.breachTotals);
      }
    });
    axios.get(AppUrl.GetRenterTotalNumberBreachMade).then((response) => {
      if (response.data.status === 200) {
        setRenterBreachMadeTotal(response.data.renterTotal);
        console.log(response.data.renterTotal);
      }
    });
    axios.get(AppUrl.ShowBreachHistories).then((response) => {
      if (response.data.status === 200) {
        setBreachHistories(response.data.allBreachHistories);
      }
    });
    if (breachHistoriesChange) {
      setBreachHistoriesChange(false);
    }
    setLoading(false);
  }, [breachHistoriesChange]);

  const showModal = () => {
    var model = new window.bootstrap.Modal(
      document.getElementById("addBreachHistoryModal")
    );
    model.show();
  };

  const handleInput = (e) => {
    e.persist();
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const addBreachHistory = (e) => {
    e.preventDefault();
    const data = {
      breach_id: input.breach_id,
      renter_id: input.renter_id,
      violate_at: moment(violateMoment).utc().format("YYYY-MM-DD hh:mm:ss"),
    };
    axios
      .post(AppUrl.StoreBreachHistory, data)
      .then((response) => {
        if (response.data.status === 200) {
          setErrors([]);
          //Delete input after submit the form
          setInput({
            breach_id: "",
            renter_id: "",
          });
          setViolateMoment(moment());
          swal("Success", response.data.message, "success");
          setBreachHistoriesChange(true);
        } else if (response.data.status === 422) {
          setErrors(response.data.errors);
          setTimeout(() => {
            showModal();
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const findUser = (e) => {
    e.preventDefault();
    if (input.renter_id) {
      axios
        .get(AppUrl.FindName + input.renter_id)
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

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Total: ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (data, index) => {
		setActiveIndex(index);
	};

  var columns = [];
  if (loading) {
    return <Loading />;
  } else {
    columns = [
      { title: '#', render: (rowData) => rowData.tableData.id + 1 },
      {
        field: "breach_id",
        title: "Breach name",
        render: (rowData) => <p>{rowData.breach.name}</p>,
      },
      {
        field: "renter_id",
        title: "Renter",
        render: (rowData) => <p>{rowData.renter.name}</p>,
      },
      {
        field: "violate_at",
        title: "Violate at",
        render: rowData => moment(rowData.violate_at).format('hh:mm:ss - DD/MM/YYYY')
      },
    ];
  }

  var summarize_columns = [];
  if (loading) {
    return <Loading />;
  } else {
    summarize_columns = [
      {
        field: "renter_id",
        title: "Renter ID",
      },
      {
        field: "renter_name",
        title: "Renter name",
      },
      {
        field: "total",
        title: "Total breach made",
      },
    ];
  }

  return (
    <Fragment>
      <BarChart 
      width={500} 
      height={300} 
      data={chartData}
      margin={{ top: 30, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#82ca9d">
        <LabelList dataKey="total" position="top" />
        </Bar>
      </BarChart>

      <PieChart 
      width={550} 
      height={550}
      margin={{ top: 10, right: 100, left: 10, bottom: 5 }}
      >
				<Pie
					activeIndex={activeIndex}
					activeShape={renderActiveShape}
					data={chartData}
					cx={200}
					cy={200}
					innerRadius={60}
					outerRadius={80}
					fill="#8884d8"
					dataKey="total"
					onMouseEnter={onPieEnter}
				/>
			</PieChart>

      <button className="btn btn-primary" onClick={showModal}>
        Add new breach history
      </button>

      <form
        class="modal fade"
        id="addBreachHistoryModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add new breach history
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <hr />
              <form className="flexForm">
                <div className="formInput">
                  <label className="inputItemLabel">Renter ID:</label>
                  <input
                    type="text"
                    className="inputItem"
                    name="renter_id"
                    onChange={handleInput}
                    value={input.renter_id}
                  />
                </div>
                <button onClick={findUser}>Find person</button>
                <small className="text-danger">{errors.renter_id}</small>
                <div className="formInput">
                  <label className="inputItemLabel">Breach:</label>
                  <select
                    className="form-control"
                    name="breach_id"
                    onChange={handleInput}
                    value={input.breach_id}
                  >
                    <option selected>--- Select breach ---</option>
                    {breachesList.map((breach) => {
                      return (
                        <option value={breach.id} key={breach.id}>
                          {" "}
                          {breach.name}{" "}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <small className="text-danger">{errors.breach_id}</small>
                <div className="">
                  <label className="inputItemLabel">Violate at:</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      // label="Violate moment"
                      value={violateMoment}
                      onChange={(selectMoment) => {
                        setViolateMoment(selectMoment);
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <small className="text-danger">{errors.violate_at}</small>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
                onClick={addBreachHistory}
              >
                Add
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </form>

      <MaterialTable
        columns={columns}
        data={breachHistories}
        title="Breach histories"
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
          onRowDelete: (oldBreachHistory) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const selectBreachHistory = [...details];
                const index = oldBreachHistory.tableData.id;
                selectBreachHistory.splice(index, 1); //1: only one record
                axios
                  .delete(AppUrl.DeleteBreachHistory + oldBreachHistory.id)
                  .then((response) => {
                    if (response.data.status === 200) {
                      swal("Success", response.data.message, "success");
                      setBreachHistoriesChange(true);
                    } else if (response.data.status === 404) {
                      swal("Error", response.data.message, "error");
                    }
                  });
                resolve();
              }, 1000);
            }),
        }}
      />

      <MaterialTable
        columns={summarize_columns}
        data={renterBreachMadeTotal}
        title="Total breach made by renters"
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
            icon: 'visibility',
            tooltip: 'Details',
            onClick: (event, renter_total) => 
            history.push(`/admin/view-renter-breach-details/${renter_total.renter_id}`),
          },
        ]}
      />
    </Fragment>
  );
}
