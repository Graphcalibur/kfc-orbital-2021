import React, { Component } from "react";
import "./App.css";

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
    typing: false,
    started: false,
    startTime: 0,
    currTime: 0,
    timer: null,
  };

  startTyping = () => {
    const timer = setInterval(() => {
      this.setState({ currTime: Date.now() - this.state.startTime });
    }, 200);

    this.setState({
      typing: true,
      started: true,
      startTime: Date.now(),
      timer: timer,
    });

    this.text_input.focus();
  };

  stopTyping = () => {
    clearInterval(this.state.timer);
  };

  reset = () => {
    this.stopTyping();

    this.setState({
      curr_line_num: 0,
      curr_input: "",
      first_wrong: 0,
      typing: false,
      started: false,
      startTime: 0,
      currTime: 0,
      timer: null,
    });
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

  /* Adds underline to the line if it's the current line */
  formatLine = (line, i) => {
    return i === this.state.curr_line_num ? this.colorLine(line) : line;
  };

  /* Color letters in the current line based on whether they
    were typed correctly or wrongly */
  colorLine = (line) => {
    // Start at first non-whitespace character
    const non_whitespace = line.length - line.trim().length;

    const first_wrong = non_whitespace + this.state.first_wrong;
    const end_wrong = non_whitespace + this.state.curr_input.length;

    return (
      <span>
        {line.substring(0, non_whitespace)}
        <u>
          <span style={{ color: "#009933" }}>
            {line.substring(non_whitespace, first_wrong)}
          </span>
          <span style={{ color: "#ff0000" }}>
            {line.substring(first_wrong, end_wrong)}
          </span>
          {line.substring(end_wrong)}
        </u>
      </span>
    );
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
    const { code, curr_line_num } = this.state;
    const first_wrong = this.getFirstWrong(
      code[curr_line_num],
      event.target.value
    );

    this.setState({
      first_wrong: first_wrong,
      curr_input: event.target.value,
    });
  };

  /* Change bg color of the input to red when there is a wrong input */
  getInputStyle = () => {
    return this.state.first_wrong < this.state.curr_input.length
      ? { backgroundColor: "#ff6666" }
      : {};
  };

  padZeroes = (num) => {
    return num < 10 ? "0" + num.toString() : num;
  };

  getMinutes = () => {
    return this.padZeroes(Math.floor(this.state.currTime / 60000));
  };

  getSeconds = () => {
    return this.padZeroes(Math.floor(this.state.currTime / 1000) % 60);
  };

  render() {
    return (
      <div className="container-xl gap-3">
        <div>
          {this.state.code.map((line, i) => (
            <label htmlFor="textInput" className="form-label code" key={line}>
              {this.formatLine(line, i)}
            </label>
          ))}
        </div>

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

        <b>
          Time Taken: {this.getMinutes()}:{this.getSeconds()}
        </b>
      </div>
    );
  }
}

export default App;
