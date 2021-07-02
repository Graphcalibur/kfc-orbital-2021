import React from "react";
import { Col, Row } from "react-bootstrap";

const PlayerState = (props) => {
  return (
    <Row className="text">
      <Col md="3">
        <b>Player: </b> {props.player} {props.is_curr ? " (You)" : ""}
      </Col>
      <Col md="9">
        <b>{props.state_name}: </b> {props.state_value}
        {props.state_suffix}
      </Col>
    </Row>
  );
};

export default PlayerState;
