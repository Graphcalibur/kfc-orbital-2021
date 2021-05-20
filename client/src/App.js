import React, { Component } from "react";
import "./App.css";
import Code from "./SoloTyping/Code";
import Timer from "./SoloTyping/Timer";
import TypingStats from "./SoloTyping/TypingStats";

class App extends Component {
  state = {
    code: [
      "for (int i = 0; i < 10; i++) {",
      "\u00a0\u00a0\u00a0\u00a0cout << i << endl;",
      "}",
    ],

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

    this.text_input.focus();
  };

  reset = () => {
    this.stopTyping();

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
  };

  stopTyping = () => {
    clearInterval(this.state.timer);
  };

  /* When pressing enter, check if the text in the input
    matches the current line being typed. If it does, clear
    the input and move on to the next line */
  handleSubmit = (event) => {
    if (event.key === "Enter") {
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

  /* Change bg color of the input to red when there is a wrong input */
  getInputStyle = () => {
    return this.state.first_wrong < this.state.curr_input.length
      ? { backgroundColor: "#ff6666" }
      : {};
  };

  render() {
    return (
      <div className="container-xl gap-3">
        <Code
          code={this.state.code}
          curr_line_num={this.state.curr_line_num}
          first_wrong={this.state.first_wrong}
          curr_input_len={this.state.curr_input.length}
        />

        <input
          type="text"
          className="form-control code mb-4"
          autoComplete="off"
          placeholder="Start typing here..."
          style={this.getInputStyle()}
          value={this.state.curr_input}
          readOnly={!this.state.typing}
          onKeyPress={this.handleSubmit}
          ref={(input) =>
            (this.text_input = input)
          } /* for autofocusing after clicking start */
          onChange={(event) => this.handleInputChange(event)}
        />

        <button
          onClick={this.startTyping}
          type="button"
          className="btn btn-primary me-4"
          disabled={this.state.started}
        >
          Start
        </button>

        <button
          onClick={this.reset}
          type="button"
          className="btn btn-primary me-4"
        >
          Reset
        </button>

        <Timer elapsed_time={this.state.elapsed_time} />

        <TypingStats
          ended={this.state.started && !this.state.typing}
          code={this.state.code}
          typed_wrong={this.state.typed_wrong}
          elapsed_time={this.state.elapsed_time}
        />
      </div>
    );
  }
}

export default App;
