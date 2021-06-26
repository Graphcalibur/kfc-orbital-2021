import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import "./Typing.css";
import Code from "./components/Code";
import Header from "./components/Header";
import TypingStats from "./components/TypingStats";
import Timer from "./components/Timer";
import TypingInput from "./components/TypingInput";

class Typing extends Component {
  state = {
    first_wrong: 0,
  };

  componentDidMount() {
    this.text_input.focus();
  }

  /* When pressing enter, check if the text in the input
      matches the current line being typed. If it does, clear
      the input and move on to the next line */
  handleSubmit = (event) => {
    if (event.key === "Enter" && this.props.typing) {
      const { curr_input, code, curr_line_num } = this.props;

      if (curr_input === code[curr_line_num].trim()) {
        this.setState({ first_wrong: 0 });
        this.props.handleSubmit();
      }
    }
  };

  /* Get first wrong character in input */
  getFirstWrong = (line, curr_input) => {
    const trimmed_line = line.trim();
    let i = 0;

    for (; i < trimmed_line.length && i < curr_input.length; i++) {
      if (trimmed_line.charAt(i) !== curr_input.charAt(i)) {
        break;
      }
    }

    this.setState({ first_wrong: i });
  };

  /* Check for wrong inputs whenever the input changes */
  handleInputChange = (event) => {
    if (!this.props.started) {
      this.props.startTyping();
    }

    const { code, curr_line_num } = this.props;
    const new_input = event.target.value;
    this.getFirstWrong(code[curr_line_num], new_input);

    this.props.handleInputChange(this.state.first_wrong, new_input);
  };

  render() {
    const ended = this.props.started && !this.props.typing;
    const { curr_input } = this.props;

    return (
      <Container>
        <h1 className="text">Solo Practice</h1>

        <Row>
          <Col md="9" fluid="sm">
            <Container className="shadow p-3 box">
              <Timer
                elapsed_time={this.props.elapsed_time}
                typing={this.state.typing}
              />

              <Code
                code={this.props.code}
                curr_line_num={this.props.curr_line_num}
                first_wrong={this.state.first_wrong}
                curr_input_len={curr_input.length}
              />

              <TypingInput
                is_wrong={this.state.first_wrong < curr_input.length}
                curr_input={curr_input}
                ended={ended}
                handleSubmit={this.handleSubmit}
                handleInputChange={this.handleInputChange}
                setRef={(input) => {
                  this.text_input = input;
                }}
              />

              <Link to={`/lang`}>
                <button className="btn me-2 btn-outline-primary">
                  Back to Language Selection
                </button>
              </Link>
            </Container>

            <TypingStats
              ended={ended}
              wpm={this.props.wpm}
              accuracy={this.props.accuracy}
              reset={this.props.reset}
              getCode={this.props.getCode}
            />
          </Col>

          <Col md="3" fluid="sm">
            <Header
              language={this.props.language}
              code_length={this.props.code_length}
              code_lines={this.props.code.length}
            />
            <span></span>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(SoloTyping);
