import React from "react";
import { Col, Row } from "react-bootstrap";

const HomeRow = (props) => {
  return (
    <span>
      <h5 className="text mt-4">
        <b>{props.header}</b>
      </h5>

      <Row className="justify-content-evenly">
        <Col md="6" className="p-3">
          {props.component_left}
        </Col>
        <Col md="6" className="p-3">
          {props.component_right}
        </Col>
      </Row>
    </span>
  );
};

export default HomeRow;
