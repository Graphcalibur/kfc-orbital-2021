import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Vim from "./Vim";

class VimPractice extends Component {
  state = {
    text: "",
    initial_text: "",
    goal_text: "",

    id: "",

    editing: false,
    started: false,
  };

  componentDidMount() {
    fetch("/api/code/fetch?lang=vim")
      .then((res) => res.json())
      .then((res) => res[0])
      .then((data) => {
        this.setState(
          {
            goal_text: data["code"],
            id: data["id"],
          },
          this.createInititalText
        );
      });
  }

  createInititalText = () => {
    let initial_text = this.state.goal_text + "f";
    console.log("f");
    this.setState({ initial_text: initial_text, text: initial_text });
  };

  reset = () => {
    this.setState({ text: this.state.initial_text });
  };

  /* Update text state on vim change. Also check if need to change
     started/editing state or if the editing has ended */
  onVimChange = (editor, data, value) => {
    const new_state = { text: value };
    if (!this.state.started) {
      new_state.editing = true;
      new_state.started = true;
    }

    if (value === this.state.goal_text) {
      new_state.editing = false;
    }

    this.setState(new_state);
  };

  render() {
    const ended = this.state.started && !this.state.editing;
    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Vim Practice</b>
        </h1>

        <Row>
          <Col md="6">
            <Vim
              text={this.state.text}
              onVimChange={this.onVimChange}
              is_practice={true}
              read_only={ended}
            />
          </Col>
          <Col md="6">
            <Vim
              text={this.state.goal_text}
              onVimChange={this.onVimChange}
              is_practice={true}
              read_only={true}
            />
          </Col>
        </Row>

        <Button variant="outline-info" className="mb-4" onClick={this.reset}>
          Reset
        </Button>
      </Container>
    );
  }
}

export default VimPractice;
