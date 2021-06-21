import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import spaceship from "./images/spaceship.png";
import ufo from "./images/ufo.png";

const Home = () => {
  const history = useHistory();

  return (
    <Container className="mt-4">
      <h5 className="text">
        <b>Improve Your Code Typing Skills:</b>
      </h5>
      <Row className="justify-content-evenly">
        <Col md="6" className="p-3" fluid="sm">
          <Container className="shadow p-3 box">
            <Row className="justify-content-between">
              <Col md="7">
                <h3 className="text">
                  <b>Multiplayer Racing</b>
                </h3>
                <p className="text">
                  Test your code typing skills by racing against other people!
                </p>
                <Button
                  variant="outline-primary"
                  onClick={() => history.push(`/lang`)}
                >
                  Race Against Others
                </Button>
              </Col>
              <Col md="5">
                <img src={spaceship} alt="" />
              </Col>
            </Row>
          </Container>
        </Col>
        <Col md="6" className="p-3" fluid="sm">
          <Container className="shadow p-3 box">
            <Row className="justify-content-between">
              <Col md="6">
                <h3 className="text">
                  <b>Solo Practice</b>
                </h3>
                <p className="text">
                  Practice your code typing skills at your own pace.
                </p>
                <Button
                  variant="outline-primary"
                  onClick={() => history.push(`/lang`)}
                >
                  Practice On Your Own
                </Button>
              </Col>
              <Col md="6">
                <img src={ufo} alt="" />
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
