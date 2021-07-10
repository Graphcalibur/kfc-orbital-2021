import React from "react";
import { Col, Row } from "react-bootstrap";

import rocket_red from "../images/rocket_red.png";
import rocket_green from "../images/rocket_green.png";
import rocket_blue from "../images/rocket_blue.png";
import rocket_purple from "../images/rocket_purple.png";
import rocket_yellow from "../images/rocket_yellow.png";
import rocket_brown from "../images/rocket_brown.png";
import race_end from "../images/race_end.png";

const PlayerState = (props) => {
  //const max_div_width = 350;
  //const div_width = Math.floor((max_div_width * props.progress) / 100);
  const colors = [
    rocket_red,
    rocket_green,
    rocket_blue,
    rocket_purple,
    rocket_yellow,
    rocket_brown,
  ];

  return (
    <Row className="text">
      <Col md="3">
        <b>Player: </b> {props.player} {props.is_curr ? " (You)" : ""}
      </Col>
      <Col md="5">
        <div
          style={{
            background: "rgba(0, 0, 0, 0)",
            height: "1px",
            width: `${props.progress * 0.74}%`,
            float: "left",
          }}
        />
        <img src={colors[props.color]} alt="" style={{ float: "left" }} />
        <img src={race_end} alt="" style={{ float: "right" }} />
      </Col>
      <Col md="4">
        {props.ended
          ? props.score.toString() + " WPM"
          : props.progress.toString() + "%"}
      </Col>
    </Row>
  );
};

export default PlayerState;
