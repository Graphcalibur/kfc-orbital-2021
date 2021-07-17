import React, { Component } from "react";
import { Button, Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Vim from "./Vim";

const tutorial_data = require("./VimTutorialData.json");

/* TODO:
- Store results of texts in other parts so that if you hit back
you don't have to redo the lesson?
*/

class VimTutorial extends Component {
  state = {
    part: 0,
    title: "",
    instructions: [],
    initial_text: "",
    goal_text: "",
    text: "",
  };

  componentDidMount() {
    let { part } = this.props.match.params;

    part = parseInt(part, 10);

    /* Default to part 0 if the parameter is not a number
    or is greater than the number of tutorial parts */
    if (isNaN(part) || part >= tutorial_data.length) {
      part = 0;
    }

    this.updatePart(part);
  }

  /* Update the state with the data of the passed part */
  updatePart = (part) => {
    this.setState(
      {
        part: part,
        title: tutorial_data[part]["title"],
        instructions: tutorial_data[part]["instructions"],
        initial_text: tutorial_data[part]["initial_text"],
        goal_text: tutorial_data[part]["goal_text"],
      },
      this.reset
    );
  };

  /* Returns back button if not on the first part */
  getBackBtn = () => {
    return this.state.part === 0 ? (
      <span></span>
    ) : (
      <Button
        onClick={() => {
          this.updatePart(this.state.part - 1);
        }}
        variant="outline-info"
        className="mb-4 me-4"
      >
        Back
      </Button>
    );
  };

  /* Returns next button if not on the last part */
  getNextBtn = () => {
    return this.state.part === tutorial_data.length - 1 ? (
      <span></span>
    ) : (
      <Button
        onClick={() => {
          this.updatePart(this.state.part + 1);
        }}
        variant="outline-info"
        style={{ float: "right" }}
        disabled={this.state.text !== this.state.goal_text}
        className="mb-4"
      >
        Next
      </Button>
    );
  };

  /* Reset text in vim editor to the initial text of the current part */
  reset = () => {
    this.setState({ text: this.state.initial_text });
  };

  onVimChange = (editor, data, value) => {
    this.setState({ text: value });
  };

  render() {
    const { part } = this.state;

    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Vim Tutorial</b>
        </h1>

        <h5 className="text">
          <b>
            Part {part}: {this.state.title}
          </b>
        </h5>

        <ul className="text" style={{ width: "80%" }}>
          {this.state.instructions.map((instruction, i) => (
            <li key={i}>{instruction}</li>
          ))}
        </ul>

        <Vim text={this.state.text} onVimChange={this.onVimChange} />

        {this.getBackBtn()}

        <Button onClick={this.reset} variant="outline-info" className="mb-4">
          Reset
        </Button>

        {this.getNextBtn()}
      </Container>
    );
  }
}

export default withRouter(VimTutorial);
