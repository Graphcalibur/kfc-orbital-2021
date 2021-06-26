import React from "react";
import { Col, Row } from "react-bootstrap";

const PlayerState = (props) => {
  return (
    <Row className="text">
      <Col md="3">
        <b>Player: </b> {props.player}
      </Col>
      <Col md="9">
        <b>Progress: </b> {props.percentage}%
      </Col>
    </Row>
  );
};

export default PlayerState;
