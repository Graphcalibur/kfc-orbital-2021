import React from "react";
import { Col, Row } from "react-bootstrap";
import WhiteLine from "./WhiteLine";

const Stats = (props) => {
  const { name, stats } = props;
  const stats_titles = [
    "Avg. Speed (All Time)",
    "Avg. Speed (Recent)",
    "Best Speed (All Time)",
    "Best Speed (Recent)",
    "Avg. Accuracy (All Time)",
    "Avg. Accuracy (Recent)",
    "Code Snippets Typed",
    "Races Won",
  ];
  const addendums = [" WPM", " WPM", " WPM", " WPM", "%", "%", "", ""];

  const color_stat = (stat, i) => {
    if (i >= 6) return "white";

    const color = ["#ffaa00", "#e6e600", "#00e64d", "#00ffff"];
    let threshold = [];

    if (i <= 3) {
      // stat is speed
      threshold = [40, 60, 80, 100];
    } else {
      // stat is accuracy
      threshold = [80, 90, 95, 99];
    }

    for (let j = 4; j >= 0; j--) {
      if (stat >= threshold[j]) {
        return color[j];
      }
    }

    return "#ff1a1a";
  };

  return (
    <Col fluid="sm" md="3" className="shadow p-3 box">
      <h4 className="text">{name} Stats</h4>
      <WhiteLine />

      {stats.map((stat, i) => (
        <Row classname="mt-1 ">
          <Col md="8" className="text">
            {stats_titles[i]}:
          </Col>
          <Col md="4" style={{ color: color_stat(stat, i) }}>
            {stat}
            {addendums[i]}
          </Col>
        </Row>
      ))}
    </Col>
  );
};

export default Stats;
