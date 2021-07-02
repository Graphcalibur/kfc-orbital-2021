import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const LeaderboardSpot = (props) => {
  const { rank, name, speed } = props;

  return (
    <Row className="text">
      <Col md="2">{rank}</Col>
      <Col md="6">{name}</Col>
      <Col md="4">{speed} WPM</Col>
    </Row>
  );
};

export default LeaderboardSpot;
