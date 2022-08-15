import React, { Fragment, useEffect, useState } from "react";

import axios from "axios";
import ReactApexChart from "react-apexcharts";

import AppUrl from "../../../RestAPI/AppUrl";
import Loading from "../../Loading/Loading";

export default function AllCharts() {
  const [loading, setLoading] = useState(true);
  const [roomsCount, setRoomsCount] = useState([]);
  const [rentersCount, setRentersCount] = useState([]);
  const [usedServicesCount, setUsedServicesCount] = useState([]);

  useEffect(() => {
    axios.get(AppUrl.CountRoomsByStatus).then((response) => {
      if (response.data.status === 200) {
        setRoomsCount(response.data.roomsCount);
      }
    });
    axios.get(AppUrl.CountRentersByGender).then((response) => {
      if (response.data.status === 200) {
        setRentersCount(response.data.rentersCount);
        console.log(response.data.gendersCount);
      }
    });
    axios.get(AppUrl.CountUsedServices).then((response) => {
      if (response.data.status === 200) {
        setUsedServicesCount(response.data.usedServicesCount);
      }
    
    });
    
    setLoading(false);
  }, []);

  let donutChart = {
    options: {
      chart: {
        width: 380,
        type: "donut",
        toolbar: {
          show: true,
        },
      },
      noData:{text:"Empty Data"},
      //labels: ,
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: true,
      },
      fill: {
        type: "gradient",
      },
      legend: {
        formatter: function (val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
      },
      title: {
        text: "Count rooms by status",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  let pieChart = {
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      //labels: genders,
      noData:{text:"Empty Data"},
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const columnChart = {};

  if (loading) {
    return <Loading />;
  } else {
    return (
      <Fragment>

    <ReactApexChart
          options={donutChart.options}
          series={roomsCount}
          type="donut"
          width={380}
        />

      </Fragment>
    );
  }
}
