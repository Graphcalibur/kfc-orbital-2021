import React from "react";
import { Button, Col, Row, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomeContainer = (props) => {
  return (
    <Container className="p-3 box">
      <Row className="justify-content-between">
        <Col md={props.col_text}>
          <h3 className="text">
            <b>{props.header}</b>
          </h3>
          <p className="text">{props.description}</p>
          <Link to={props.btn_link}>
            <Button variant="outline-info">{props.btn_text}</Button>
          </Link>
        </Col>

        <Col md={props.col_img}>
          <img src={props.image} alt="" />
        </Col>
      </Row>
    </Container>
  );
};

export default HomeContainer;
