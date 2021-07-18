import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";
import Vim from "./Vim";

class VimPractice extends Component {
  state = {
    text: "",
    initial_text: "",
    goal_text: "",
  };

  onVimChange = (editor, data, value) => {
    this.setState({ text: value });
  };

  render() {
    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Vim Practice</b>
        </h1>

        <Vim text={this.state.text} onVimChange={this.onVimChange} />

        <Button variant="outline-info" className="mb-4">
          Reset
        </Button>
      </Container>
    );
  }
}

export default VimPractice;
