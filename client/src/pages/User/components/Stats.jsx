import React from "react";
import { Col, Row } from "react-bootstrap";

import ProgressChart from "./ProgressChart";

const Stats = (props) => {
  const { stats } = props;
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
    <Row className="mt-3">
      <Col md="4">
        {stats.map((stat, i) => (
          <Row classname="mt-1 ">
            <Col md="7" className="text">
              {stats_titles[i]}:
            </Col>
            <Col md="5" style={{ color: color_stat(stat, i) }}>
              {Math.round(stat * 10) / 10}
              {addendums[i]}
            </Col>
          </Row>
        ))}
      </Col>

      <Col md="8">
        <ProgressChart className="p-4" wpm_data={props.wpm_data} />
      </Col>
    </Row>
  );
};

export default Stats;
