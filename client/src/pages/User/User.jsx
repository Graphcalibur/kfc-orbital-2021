import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";

import Stats from "./components/Stats";

class User extends Component {
  state = {
    name: "",
  };

  componentDidMount() {
    const { user } = this.props.match.params;
    console.log(user);
    this.setState({ name: user });
  }

  render() {
    const temp = [0, 0, 0, 0, 0, 0, 0];
    return (
      <div>
        <Container fluid="sm" className="shadow p-3 box">
          <h1 className="text">{this.state.name}'s Profile</h1>
        </Container>

        <Row className="mt-3 justify-content-evenly">
          <Stats name="All" stats={temp} />
          <Stats name="Racing" stats={temp} />
          <Stats name="Solo" stats={temp} />
        </Row>
      </div>
    );
  }
}

export default User;
