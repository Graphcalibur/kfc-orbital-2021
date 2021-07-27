import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
import speedometer from "../images/speedometer.png";

const ViewStats = (props) => {
  const text =
    props.user === null ? (
      <p className="text">
        Log in or make an account to track your typing stats!
      </p>
    ) : (
      <span>
        <p className="text">
          Check out your WPM and Accuracy to see how you've improved over time!
        </p>
        <Link to={`/user/` + props.user}>
          <Button variant="outline-info">View Your Stats</Button>
        </Link>
      </span>
    );

  return (
    <Container className="p-3 box">
      <Row className="justify-content-between">
        <Col md="7">
          <h3 className="text">
            <b>User Stats</b>
          </h3>

          {text}
        </Col>

        <Col md="5">
          <img src={speedometer} alt="" />
        </Col>
      </Row>
    </Container>
  );
};

export default ViewStats;
