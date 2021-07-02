import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import spaceship from "./images/spaceship.png";
import ufo from "./images/ufo.png";
import lightspeed from "./images/lightspeed.jpg";

import ViewStats from "./components/ViewStats";
import Leaderboard from "./components/Leaderboard";

class Home extends Component {
  state = {
    user: null,
    leaderboard: [{ name: "abacaba123", speed: 60 }],
  };

  componentDidMount() {
    fetch("/api/current-login", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const new_curr_user = data === null ? data : data["username"];
        this.setState({ user: new_curr_user });
      });
  }

  getLeaderboard = () => {
    const { leaderboard } = this.state;

    if (leaderboard.length === 0) {
      return;
    }
  };

  render() {
    return (
      <div>
        <Container
          className="shadow p-3"
          style={{
            backgroundImage: `url(${lightspeed})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "1200px",
          }}
        >
          <h1 style={{ fontSize: "70px" }} className="text">
            CodeRacer
          </h1>
          <h5 className="text">
            Making typing code fun, exciting, and competitive.
          </h5>
        </Container>

        <Container className="mt-4">
          <h5 className="text">
            <b>Improve Your Code Typing Skills</b>
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
                      Test your code typing skills by racing against other
                      people!
                    </p>
                    <Link to={`/rooms`}>
                      <Button variant="outline-primary">
                        Race Against Others
                      </Button>
                    </Link>
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
                    <Link to={`/lang`}>
                      <Button variant="outline-primary">
                        Practice On Your Own
                      </Button>
                    </Link>
                  </Col>

                  <Col md="6">
                    <img src={ufo} alt="" />
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>

          <h5 className="text mt-4">
            <b>Your Progress and Others'</b>
          </h5>

          <Row className="justify-content-evenly">
            <Col md="6" className="p-3" fluid="sm">
              <Leaderboard leaderboard={this.state.leaderboard} />
            </Col>

            <Col md="6" className="p-3" fluid="sm">
              <ViewStats user={this.state.user} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
