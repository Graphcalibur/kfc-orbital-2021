import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";

import Stats from "./components/Stats";

class User extends Component {
  state = {
    user_exists: true,
    name: "",
    all_stats: [0, 0, 0, 0, 0, 0, 0],
    race_stats: [0, 0, 0, 0, 0, 0, 0],
    solo_stats: [0, 0, 0, 0, 0, 0, 0],
  };

  componentDidMount() {
    const { user } = this.props.match.params;
    console.log(user);

    const url = "/api/stats/summary/" + user;

    fetch(url)
      .then((res) => {
        if (false) {
          // TODO: Check if user exists
          return null;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data === null) {
          this.setState({ user_exists: true });
        } else {
          const all_stats = [
            data["speed"]["average"],
            0,
            data["speed"]["maximum"],
            0,
            data["accuracy"]["average"],
            0,
            data["playcount"],
          ];
          this.setState({
            name: user,
            all_stats: all_stats,
          });
        }
      });

    /*fetch(url)
      .then((res) => res.json())
      .then((res) => res[0])
      .then((data) => {
        this.setState({
          code: data["code"].split("\n"),
          language: data["language"],
        });
      });*/
  }

  render() {
    return (
      <div>
        <Container fluid="sm" className="shadow p-3 box">
          <h1 className="text">
            {this.state.user_exists
              ? this.state.name + "'s Profile"
              : "The user does not exist."}
          </h1>
        </Container>

        <Row className="mt-3 justify-content-evenly">
          <Stats name="All" stats={this.state.all_stats} />
          <Stats name="Racing" stats={this.state.race_stats} />
          <Stats name="Solo" stats={this.state.solo_stats} />
        </Row>
      </div>
    );
  }
}

export default User;
