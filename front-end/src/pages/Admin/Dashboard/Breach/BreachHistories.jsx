import React, { Fragment, useState, useEffect } from "react";
import MaterialTable from "material-table";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";

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
import CreateBreachHistoryModal from "../../../../components/Modals/Breach/CreateBreachHistoryModal";

export default function BreachHistories() {
  const history = useHistory();

  const [details] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [breachHistories, setBreachHistories] = useState([]);
  const [breachHistoriesChange, setBreachHistoriesChange] = useState(false);
  const [renterBreachMadeTotal, setRenterBreachMadeTotal] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
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

  const setCreateModalStatus = (status) => {
    setShowCreateModal(status);
  };

  const updateCreateModalStatus = (status) => {
    setBreachHistoriesChange(status);
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

      <button 
      className="btn btn-primary" 
      onClick={(e) => setShowCreateModal(true)}
      >
        Add new breach history
      </button>
      <CreateBreachHistoryModal
        isShown={showCreateModal}
        setCreateModalStatus={setCreateModalStatus}
        updateCreateModalStatus={updateCreateModalStatus}
      />

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
