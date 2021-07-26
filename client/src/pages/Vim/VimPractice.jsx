import React, { Component } from "react";
import {
  Button,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import Vim from "./components/Vim";
import Timer from "../../components/Timer";

const errors = require("./data/VimPracticeErrors.json");

class VimPractice extends Component {
  state = {
    text: "",
    initial_text: "",
    goal_text: "",

    id: "",
    language: "",

    editing: false,
    started: false,

    error: 0,

    start_time: 0,
    elapsed_time: 0,
    timer: null,
  };

  componentDidMount() {
    this.getCode();
  }

  getCode = () => {
    fetch("/api/code/fetch")
      .then((res) => res.json())
      .then((res) => res[0])
      .then((data) => {
        this.setState(
          {
            goal_text: data["code"],
            id: data["id"],
            language: data["language"],
          },
          this.createInititalText
        );
      });
  };

  /* Returns a random number from lo to hi, inclusive */
  generateRN = (lo, hi) => {
    return Math.floor(Math.random() * (hi - lo + 1) + lo);
  };

  createInititalText = () => {
    let initial_text = this.state.goal_text;

    /* Adds 4 singular words and 4 multiple words into the string */
    for (let i = 0; i < 2; i++) {
      for (let addition = 0; addition < 4; addition++) {
        const loc = this.generateRN(0, initial_text.length - 1);
        const str = errors[i][this.generateRN(0, errors[i].length - 1)];
        initial_text =
          initial_text.substring(0, loc) + str + initial_text.substring(loc);
      }
    }

    /* Only add the possible multiple lines directly after a newline
    character in the initial_text so they don't end up splitting a
    line in two. */
    for (let addition = 0; addition < 2; addition++) {
      const new_initial_text = initial_text.split("\n");

      const loc = this.generateRN(0, new_initial_text.length - 1);
      const str = errors[2][this.generateRN(0, errors[2].length - 1)];

      new_initial_text.splice(loc, 0, str);
      initial_text = new_initial_text.join("\n");
    }

    this.setState({ initial_text: initial_text, text: initial_text });
  };

  startEditing = () => {
    const timer = setInterval(() => {
      this.setState({ elapsed_time: Date.now() - this.state.start_time });
    }, 200);

    this.setState({
      editing: true,
      started: true,
      start_time: Date.now(),
      timer: timer,
    });
  };

  stopEditing = () => {
    clearInterval(this.state.timer);
    this.setState({ editing: false });
  };

  reset = () => {
    this.setState({
      editing: false,
      started: false,

      error: 0,

      start_time: 0,
      elapsed_time: 0,
      timer: null,
    });

    this.resetText();
  };

  resetText = () => {
    this.setState({ text: this.state.initial_text });
  };

  /* Update text state on vim change. Also check if need to change
     started/editing state or if the editing has ended */
  onVimChange = (editor, data, value) => {
    const new_state = { text: value };
    if (!this.state.started) {
      this.startEditing();
    }

    if (value === this.state.goal_text) {
      this.stopEditing();
    }

    this.setState(new_state);
  };

  check = () => {
    const goal_text = this.state.goal_text.split("\n");
    const text = this.state.text.split("\n");

    for (let i = 0; i < goal_text.length; i++) {
      if (goal_text[i] !== text[i]) {
        this.setState({ error: i + 1 });
        return;
      }
    }

    this.setState({ error: -1 });
  };

  getCheckText = () => {
    const { error } = this.state;
    return error === 0 ? (
      <span></span>
    ) : error === -1 ? (
      <span className="text">No errors found.</span>
    ) : (
      <span className="text">
        The first error found is at line {this.state.error}.
      </span>
    );
  };

  getInstructionTooltip = () => {
    return (
      <Tooltip>
        Fix all the errors in the text on the left so it exactly matches the
        text on the right. Timing starts when you make your first edit and ends
        when the two texts match!
      </Tooltip>
    );
  };

  render() {
    const ended = this.state.started && !this.state.editing;
    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Vim Practice</b>
        </h1>

        <Timer
          elapsed_time={this.state.elapsed_time}
          ended={ended}
          started={this.state.started}
        />

        <Row className="mt-3">
          <Col md="6">
            <span className="text">Your Editor</span>
            <Vim
              text={this.state.text}
              onVimChange={this.onVimChange}
              language={this.state.language}
              read_only={ended}
            />
          </Col>
          <Col md="6">
            <span className="text">Your Goal</span>
            <Vim
              text={this.state.goal_text}
              onVimChange={this.onVimChange}
              language={this.state.language}
              read_only={true}
            />
          </Col>
        </Row>

        <Button
          variant="outline-info"
          className="me-3"
          onClick={this.resetText}
          disabled={ended}
        >
          Reset
        </Button>

        <OverlayTrigger
          trigger="click"
          placement="top"
          overlay={this.getInstructionTooltip()}
        >
          <Button variant="outline-info" className="me-3">
            Instructions
          </Button>
        </OverlayTrigger>

        <Button variant="outline-info" className="me-3" onClick={this.check}>
          Check
        </Button>

        {this.getCheckText()}

        <Button
          variant="outline-info"
          onClick={() => {
            this.getCode();
            this.reset();
          }}
          style={{ float: "right" }}
          disabled={!ended}
        >
          New Practice
        </Button>

        <Button
          variant="outline-info"
          className="me-3"
          onClick={this.reset}
          style={{ float: "right" }}
          disabled={!ended}
        >
          Try Again
        </Button>
      </Container>
    );
  }
}

export default VimPractice;
