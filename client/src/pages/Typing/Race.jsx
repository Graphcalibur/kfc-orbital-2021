import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";

import "./Typing.css";
import Code from "./components/Code";
import Header from "./components/Header";
import PlayerState from "./components/PlayerState";
import Timer from "./components/Timer";
import TypingInput from "./components/TypingInput";
import TypingStats from "./components/TypingStats";

// TODO: Handle error where user enters Race without entering a room
// TODO: Handle user leaving a Race early
// TODO: Add Countdown

class Race extends Component {
  state = {
    code: this.props.snippet["code"].split("\n"),
    language: this.props.snippet["language"],
    id: this.props.snippet["id"],

    curr_line_num: 0,
    curr_input: "",

    first_wrong: 0,

    typing: false,
    started: false,

    elapsed_time: 0,

    countdown: 100,
    player_states: [],

    curr_player: "",
    game_ended: false,
    scores: [],
    curr_player_score: { speed: 0, acc: 0 },

    keep_room: false,
  };

  componentDidMount() {
    /* Get countdown and start typing when the countdown ends */
    this.props.socket.on("start-game-countdown", (data) => {
      this.setState({ countdown: data["seconds_to_start"] });

      if (this.state.countdown === 0) {
        this.startTyping();
      }
    });

    /* Don't update elapsed_time if player is done typing */
    this.props.socket.on("update-race-state", (data) => {
      if (this.state.typing) {
        this.setState({
          elapsed_time: data["duration_since_start"],
          player_states: data["player_states"],
        });
      } else {
        this.setState({
          player_states: data["player_states"],
        });
      }
    });

    this.props.socket.on("signal-game-end", (data) => {
      console.log(data);
      this.setState({
        game_ended: true,
        scores: data["scores"],
        curr_player_score: this.getCurrPlayerScore(data["scores"]),
      });
    });

    /* Get current user */
    this.props.socket.on("check-current-login-return", (player) => {
      if (player === null) return;
      this.setState({ curr_player: player["username"] });
    });

    this.props.socket.emit("check-current-login");
    this.setState({ keep_room: false });
  }

  componentWillUnmount() {
    if (!this.state.keep_room) {
      console.log("lol");
      this.props.socket.emit("leave-room");
    }
  }

  sendPlayerState = () => {
    this.props.socket.emit("update-player-state", {
      mistypes: this.state.typed_wrong,
      line_no: this.state.curr_line_num,
      current_line: this.state.curr_input,
    });
  };

  startTyping = () => {
    this.setState({
      typing: true,
      started: true,
    });
    this.text_input.focus();
  };

  /* TODO: Not sure if this is still needed? */
  stopTyping = () => {
    this.sendPlayerState();
  };

  /* Go back to Waiting Room, but don't leave the room */
  backToWaitingRoom = (history) => {
    /* This makes sure state is updated before changing page to /waitingroom */
    this.setState({ keep_room: true }, () => history.push(`/waitingroom`));
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

  /* Check for wrong inputs whenever the input changes and sends player state */
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

    this.sendPlayerState();
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

  /* Calculates progress of a player in % */
  getPlayerProgress = (player_state) => {
    const { code } = this.state;
    const line_no = player_state["line_no"];
    if (line_no >= code.length) return 100;

    let curr_len = this.getFirstWrong(
      code[line_no],
      player_state["current_line"]
    );
    for (let i = 0; i < line_no; i++) {
      curr_len += code[i].trim().length;
    }

    return Math.round((curr_len * 100) / this.getCodeLength());
  };

  /* Decide which text to render above the main typing container
  Game Ended --> Players' Scores
  Game In Progress --> Players' Progress
  Game Not Started --> Countdown
  */
  getTopText = () => {
    if (this.state.game_ended) {
      return this.state.scores.map((score) => (
        <PlayerState
          player={score["user"]["username"]}
          state_name="Score"
          state_value={score["score"]["speed"]}
          state_suffix=" WPM"
        />
      ));
    } else if (this.state.started) {
      return this.state.player_states.map((player_state) => (
        <PlayerState
          player={player_state["user"]["username"]}
          state_name="Progress"
          state_value={this.getPlayerProgress(player_state)}
          state_suffix="%"
        />
      ));
    } else {
      return (
        <span className="text">
          <b>Countdown: </b> {this.state.countdown}
        </span>
      );
    }
  };

  /* Gets the current player's score from the list of scores */
  getCurrPlayerScore = (scores) => {
    for (let i = 0; i < scores.length; i++) {
      if (scores[i]["user"]["username"] === this.state.curr_player) {
        return scores[i]["score"];
      }
    }
  };

  render() {
    const { curr_input } = this.state;

    return (
      <Container fluid="lg">
        <h1 className="text mb-3">
          <b>Race</b>
        </h1>

        {this.getTopText()}

        <Row className="mt-3">
          <Col md="9">
            <Container className="shadow p-3 box">
              <Timer
                elapsed_time={this.state.elapsed_time}
                typing={this.state.typing}
              />

              <Code
                code={this.state.code}
                curr_line_num={this.state.curr_line_num}
                first_wrong={this.state.first_wrong}
                curr_input_len={curr_input.length}
              />

              <TypingInput
                is_wrong={this.state.first_wrong < curr_input.length}
                curr_input={curr_input}
                cannotType={!this.state.typing}
                handleSubmit={this.handleSubmit}
                handleInputChange={this.handleInputChange}
                setRef={(input) => {
                  this.text_input = input;
                }}
              />
            </Container>

            <TypingStats
              ended={this.state.game_ended}
              wpm={this.state.curr_player_score["speed"]}
              accuracy={this.state.curr_player_score["acc"]}
              back_to_waiting={this.backToWaitingRoom}
              is_solo={false}
            />
          </Col>

          <Col md="3">
            <Header
              language={this.state.language}
              code_length={this.getCodeLength()}
              code_lines={this.state.code.length}
              is_solo={false}
            />
            <span></span>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Race;
