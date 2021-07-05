import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";

import Typing from "./components/Typing";

class SoloTyping extends Component {
  state = {
    code: [""],
    language: "",
    id: -1,

    curr_line_num: 0,
    curr_input: "",

    first_wrong: 0,
    typed_wrong: 0,

    typing: false,
    started: false,

    start_time: 0,
    elapsed_time: 0,
    timer: null,
  };

  componentDidMount() {
    this.getCode();
    this.text_input.focus();
  }

  /* Fetches code from backend */
  getCode = () => {
    const { lang } = this.props.match.params;
    let url = "/api/code";

    if (lang !== undefined) {
      url += "?lang=" + lang;
    }

    fetch(url)
      .then((res) => res.json())
      .then((res) => res[0])
      .then((data) => {
        this.setState({
          code: data["code"].split("\n"),
          language: data["language"],
          id: data["id"],
        });
      });
  };

  startTyping = () => {
    const timer = setInterval(() => {
      this.setState({ elapsed_time: Date.now() - this.state.start_time });
    }, 200);

    this.setState({
      typing: true,
      started: true,
      start_time: Date.now(),
      timer: timer,
    });
  };

  reset = () => {
    this.setState({
      curr_line_num: 0,
      curr_input: "",
      first_wrong: 0,
      typed_wrong: 0,
      typing: false,
      started: false,
      start_time: 0,
      elapsed_time: 0,
      timer: null,
    });

    this.text_input.focus();
  };

  stopTyping = () => {
    clearInterval(this.state.timer);

    fetch("/api/current-login", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === null) return;

        const url =
          `/api/stats/upload/` +
          `${this.state.id}/${this.getWPM()}wpm/${this.getAccuracy()}`;

        fetch(url, { method: "POST", credentials: "include" });
      });
  };

  /* When pressing enter, check if the text in the input
      matches the current line being typed. If it does, clear
      the input and move on to the next line */
  handleSubmit = (event) => {
    if (event.key === "Enter" && this.state.typing) {
      const { curr_input, code, curr_line_num } = this.state;

      if (curr_input === code[curr_line_num].trim()) {
        const new_state = {
          curr_input: "",
          first_wrong: 0,
          curr_line_num: curr_line_num + 1,
        };

        if (curr_line_num === code.length - 1) {
          new_state.typing = false;
          this.stopTyping();
        }

        this.setState(new_state);
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

    return i;
  };

  /* Check for wrong inputs whenever the input changes */
  handleInputChange = (event) => {
    if (!this.state.started) {
      this.startTyping();
    }
    const { code, curr_line_num, curr_input } = this.state;

    const new_input = event.target.value;
    const new_first_wrong = this.getFirstWrong(code[curr_line_num], new_input);
    let new_typed_wrong = this.state.typed_wrong;

    /* Only count wrong characters if user added characters to the input */
    if (
      curr_input.length < new_input.length &&
      new_first_wrong < new_input.length
    ) {
      new_typed_wrong++;
    }

    this.setState({
      typed_wrong: new_typed_wrong,
      first_wrong: new_first_wrong,
      curr_input: new_input,
    });
  };

  /* Returns length of code */
  getCodeLength = () => {
    const { code } = this.state;
    let code_length = 0;

    for (let i = 0; i < code.length; i++) {
      code_length +=
        code[i].trim().length; /* Don't count starting whitespace */
    }

    return code_length;
  };

  /* WPM = (# of chars in code / 5) / time in minutes */
  getWPM = () => {
    const code_length = this.getCodeLength();
    return Math.round(code_length / 5 / (this.state.elapsed_time / 60000));
  };

  /* Accuracy = (# of chars in code / # of chars typed including wrong) * 100
       Formula does * 1000 / 10 so that it's accurate to the first decimal place */
  getAccuracy = () => {
    const code_length = this.getCodeLength();
    return (
      Math.round(
        (code_length / (this.state.typed_wrong + code_length)) * 1000
      ) / 10
    );
  };

  getBackBtn = () => {
    return (
      <Link to={`/lang`}>
        <Button variant="outline-primary">Back to Language Selection</Button>
      </Link>
    );
  };

  render() {
    const ended = this.state.started && !this.state.typing;

    return (
      <Typing
        heading="Solo Practice"
        code={this.state.code}
        language={this.state.language}
        id={this.state.id}
        curr_line_num={this.state.curr_line_num}
        curr_input={this.state.curr_input}
        first_wrong={this.state.first_wrong}
        typed_wrong={this.state.typed_wrong}
        typing={this.state.typing}
        started={this.state.started}
        elapsed_time={this.state.elapsed_time}
        ended={ended}
        is_solo={true}
        cannot_type={ended}
        wpm={this.getWPM()}
        accuracy={this.getAccuracy()}
        code_length={this.getCodeLength()}
        getTopText={() => <span></span>}
        getBackBtn={this.getBackBtn}
        reset={this.reset}
        getCode={this.getCode}
        backToWaiting={() => null}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        setRef={(input) => {
          this.text_input = input;
        }}
      />
    );
  }
}

export default withRouter(SoloTyping);