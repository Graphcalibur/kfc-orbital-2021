import React from "react";
import Chart from "react-apexcharts";

const ProgressChart = (props) => {
  const options = {
    chart: {
      height: 100,
      type: "line",
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    grid: {
      row: {
        colors: ["#233243", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    markers: { size: 5 },
    stroke: { curve: "straight" },
    title: { text: "Average WPM over Time", style: { color: "#ffffff" } },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "#ffffff" },
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM yyyy",
          day: "dd MMM yyyy",
          hour: "",
        },
      },
    },
    yaxis: { decimalsInFloat: 1, labels: { style: { colors: "#ffffff" } } },
  };

  return (
    <Chart
      options={options}
      series={[{ name: "Average WPM", data: props.wpm_data }]}
      type="area"
      height={350}
    />
  );
};

export default ProgressChart;
