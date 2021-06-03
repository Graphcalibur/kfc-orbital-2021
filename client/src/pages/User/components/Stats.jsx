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

  return (
    <Col fluid="sm" md="3" className="shadow p-3 box">
      <h4 className="text">{name} Stats</h4>
      <WhiteLine />

      {stats.map((stat, i) => (
        <Row classname="mt-1 ">
          <Col md="8" className="text">
            {stats_titles[i]}:
          </Col>
          <Col md="4" className="text">
            {stat}
            {addendums[i]}
          </Col>
        </Row>
      ))}
    </Col>
  );
};

export default Stats;
