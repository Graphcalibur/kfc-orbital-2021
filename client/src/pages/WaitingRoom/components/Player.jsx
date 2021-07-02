import React from "react";
import { Col, Row } from "react-bootstrap";

// TODO: Color status depending on ready or not ready
// TODO: Differentiate curr player from other players using props.is_curr
const Player = (props) => {
  return (
    <Row>
      <Col md="3">
        {props.name} {props.is_curr ? " (You)" : ""}{" "}
      </Col>
      <Col md="9">{props.status}</Col>
    </Row>
  );
};

export default Player;
