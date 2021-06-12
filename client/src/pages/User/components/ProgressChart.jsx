import React, { Component } from "react";
import Chart from "react-apexcharts";

class ProgressChart extends Component {
  state = {
    options: {
      chart: {
        height: 100,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: { enabled: false },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: { size: 5 },
      stroke: { curve: "straight" },
      title: { text: "Average WPM over Time" },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM yyyy",
            day: "dd MMM yyyy",
            hour: "",
          },
        },
      },
      yaxis: { decimalsInFloat: 1 },
    },
  };

  render() {
    return (
      <Chart
        options={this.state.options}
        series={[{ name: "Average WPM", data: this.props.wpm_data }]}
        type="area"
        height={350}
      />
    );
  }
}

export default ProgressChart;