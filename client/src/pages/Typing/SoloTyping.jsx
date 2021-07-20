import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PlayerState from "./components/PlayerState";

import Typing from "./components/Typing";
import {
  getCodeLength,
  getPlayerProgress,
  handleSubmitGeneric,
  handleInputChangeGeneric,
} from "./HelperFunctions";

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

    rand_num: Math.floor(Math.random() * 6),
  };

  componentDidMount() {
    this.getCode();
    this.text_input.focus();
  }

  /* Fetches code from backend */
  getCode = () => {
    const { lang } = this.props.match.params;
    const valid_langs = ["Python", "C%2B%2B"];
    let url = "/api/code/fetch";

    if (lang !== undefined && valid_langs.includes(lang)) {
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
    const new_state = handleSubmitGeneric(event, this.state);

    if (new_state !== null) {
      this.setState(new_state, () => {
        if (new_state.curr_line_num === this.state.code.length)
          this.stopTyping();
      });
    }
  };

  /* Check for wrong inputs whenever the input changes */
  handleInputChange = (event) => {
    this.setState(
      handleInputChangeGeneric(event.target.value, this.state, this.startTyping)
    );
  };

  /* WPM = (# of chars in code / 5) / time in minutes */
  getWPM = () => {
    const code_length = getCodeLength(this.state.code);
    return Math.round(code_length / 5 / (this.state.elapsed_time / 60000));
  };

  /* Accuracy = (# of chars in code / # of chars typed including wrong) * 100
       Formula does * 1000 / 10 so that it's accurate to the first decimal place */
  getAccuracy = () => {
    const code_length = getCodeLength(this.state.code);
    return (
      Math.round(
        (code_length / (this.state.typed_wrong + code_length)) * 1000
      ) / 10
    );
  };

  getTopText = (ended) => {
    const score = ended ? this.getWPM() : 0;
    return (
      <PlayerState
        player="You"
        is_curr={false}
        progress={getPlayerProgress(this.state.code, {
          line_no: this.state.curr_line_num,
          current_line: this.state.curr_input,
        })}
        score={score}
        ended={ended}
        color={this.state.rand_num}
      />
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
        code_length={getCodeLength(this.state.code)}
        getTopText={this.getTopText}
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
