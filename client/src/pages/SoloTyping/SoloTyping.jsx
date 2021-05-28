import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./SoloTyping.css";
import Code from "./components/Code";
import Header from "./components/Header";
import TypingStats from "./components/TypingStats";

class SoloTyping extends Component {
    state = {
      code: [""],
      languagae: "",
  
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
      let url = "http://localhost:9000/api/code"

      console.log(lang);
      if (lang !== undefined) {
        url += "?lang=" + lang;
      }

      fetch(url)
        .then((res) => res.json())
        .then((res) => res[0])
        .then((data) => {
          this.setState({ code: data["code"].split("\n"),
                          language: data["language"] });
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
  
    /* Change bg color of the input to red when there is a wrong input */
    getInputStyle = () => {
      return this.state.first_wrong < this.state.curr_input.length
        ? { backgroundColor: "#800000", color: "white" }
        : { backgroundColor: "#233243", color: "white" };
    };
  
    render() {
      const ended = this.state.started && !this.state.typing;

      return (
        <div>
          <div
            className="shadow p-3 container-sm gap-3 mt-3 box"
          >
            <Header
              language={this.state.language}
              elapsed_time={this.state.elapsed_time}
              typing={this.state.typing}
            />

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
              readOnly={ended}
              onKeyPress={this.handleSubmit}
              ref={(input) =>
                (this.text_input = input)
              } /* for autofocusing after clicking start */
              onChange={(event) => this.handleInputChange(event)}
            />
            
            <Link to={`/lang`}>
              <button className="btn me-2 btn-primary">
                Back to Language Selection
              </button>
            </Link>
          </div>

          <TypingStats
              ended={ended}
              code={this.state.code}
              typed_wrong={this.state.typed_wrong}
              elapsed_time={this.state.elapsed_time}
              reset={this.reset}
              getCode={this.getCode}
            />
        </div>
      );
    }
  }

  export default withRouter(SoloTyping);