import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import spaceship from "./images/spaceship.png";
import ufo from "./images/ufo.png";

import ViewStats from "./components/ViewStats";
import Leaderboard from "./components/Leaderboard";

class Home extends Component {
  state = {
    user: null,
    leaderboard: [],
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

    fetch("/api/stats/allscores")
      .then((res) => res.json())
      .then(this.generateLeaderboard);
  }

  /* Generates the daily leaderboard based on the given scorelist.
  Only displays users with >= 5 plays and rankings are based on 
  average WPM */
  generateLeaderboard = (scorelist) => {
    const data = {};
    const leaderboard = [];

    /* Creates dictionary of users and their scores and # of plays */
    scorelist.forEach((score) => {
      const username = score["username"];
      const speed = score["speed"];
      const length = 1;

      if (username in data) {
        data[username]["speed"] += speed;
        data[username]["length"] += length;
      } else {
        data[username] = { speed: speed, length: length };
      }
    });

    /* Collect all the users with >= 5 plays and their data into an array */
    Object.keys(data).forEach((key) => {
      if (data[key]["length"] >= 5) {
        leaderboard.push({
          username: key,
          speed:
            Math.round((data[key]["speed"] / data[key]["length"]) * 10) / 10,
        });
      }
    });

    /* Sort array in order of descending speed */
    leaderboard.sort((a, b) => b["speed"] - a["speed"]);
    this.setState({ leaderboard: leaderboard });
  };

  render() {
    return (
      <div>
        <center className="text">
          <h1 style={{ fontSize: "70px" }}>CodeRacer</h1>
          <h5>Making typing code fun, exciting, and competitive.</h5>
        </center>

        <Container className="mt-4">
          <h5 className="text">
            <b>Improve Your Code Typing Skills</b>
          </h5>

          <Row className="justify-content-evenly">
            <Col md="6" className="p-3" fluid="sm">
              <Container className="p-3 box">
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
                      <Button variant="outline-info">
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
              <Container className="p-3 box">
                <Row className="justify-content-between">
                  <Col md="6">
                    <h3 className="text">
                      <b>Solo Practice</b>
                    </h3>
                    <p className="text">
                      Practice your code typing skills at your own pace.
                    </p>
                    <Link to={`/lang`}>
                      <Button variant="outline-info">
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
