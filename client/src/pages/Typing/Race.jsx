import React, { Component } from "react";

import PlayerState from "./components/PlayerState";
import Typing from "./components/Typing";
import {
  getFirstWrong,
  getCodeLength,
  handleSubmitGeneric,
  handleInputChangeGeneric,
} from "./HelperFunctions";

class Race extends Component {
  state = {
    code: this.props.snippet["code"].split("\n"),
    language: this.props.snippet["language"],
    id: this.props.snippet["id"],

    curr_line_num: 0,
    curr_input: "",

    first_wrong: 0,
    typed_wrong: 0,

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
    rand_num: Math.floor(Math.random() * 6),
  };

  componentDidMount() {
    /* Get countdown and start typing when the countdown ends */
    this.props.socket.on("start-game-countdown", (data) => {
      this.setState({ countdown: data["seconds_to_start"] });

      if (data["seconds_to_start"] === 0) {
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
      /* Round speed to nearest integer and acc to first decimal place */
      const scores = data["scores"].map((score) => {
        score["score"]["speed"] = Math.round(score["score"]["speed"]);
        score["score"]["acc"] = Math.round(score["score"]["acc"] * 10) / 10;
        return score;
      });

      this.setState({
        game_ended: true,
        scores: scores,
        curr_player_score: this.getCurrPlayerScore(scores),
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
      this.props.socket.emit("leave-room");
    }

    this.props.socket.removeAllListeners("start-game-countdown");
    this.props.socket.removeAllListeners("update-race-state");
    this.props.socket.removeAllListeners("signal-game-end");
    this.props.socket.removeAllListeners("check-current-login-return");
  }

  sendPlayerState = () => {
    this.props.socket.emit("update-player-state", {
      mistypes: this.state.typed_wrong,
      line_no: this.state.curr_line_num,
      current_line: this.state.curr_input,
    });
  };

  startTyping = () => {
    this.setState(
      {
        typing: true,
        started: true,
      },
      () => {
        this.text_input.focus();
      }
    );
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
    const new_state = handleSubmitGeneric(event, this.state);

    if (new_state !== null) {
      this.setState(new_state, () => {
        if (new_state.curr_line_num === this.state.code.length)
          this.stopTyping();
      });
    }
  };

  /* Check for wrong inputs whenever the input changes and sends player state */
  handleInputChange = (event) => {
    this.setState(
      handleInputChangeGeneric(
        event.target.value,
        this.state,
        this.startTyping
      ),
      () => {
        this.sendPlayerState();
      }
    );

    this.sendPlayerState();
  };

  /* Calculates progress of a player in % */
  getPlayerProgress = (player_state) => {
    const { code } = this.state;
    const line_no = player_state["line_no"];
    if (line_no >= code.length) return 100;

    let curr_len = getFirstWrong(code[line_no], player_state["current_line"]);
    for (let i = 0; i < line_no; i++) {
      curr_len += code[i].trim().length;
    }

    return Math.round((curr_len * 100) / getCodeLength(code));
  };

  /* Decide which text to render above the main typing container
  Game Ended --> Players' Scores
  Game In Progress --> Players' Progress
  Game Not Started --> Countdown
  */
  getTopText = () => {
    const { game_ended, rand_num } = this.state;

    if (this.state.countdown === 100) {
      return (
        <span className="text mb-3">
          Hmm. It doesn't seem like you're in a race.
        </span>
      );
    } else if (game_ended) {
      return (
        <span className="mb-3">
          {this.state.scores.map((score, i) => (
            <PlayerState
              player={score["user"]["username"]}
              is_curr={score["user"]["username"] === this.state.curr_player}
              progress={100}
              score={score["score"]["speed"]}
              ended={game_ended}
              color={(i + rand_num) % 6}
            />
          ))}
        </span>
      );
    } else if (this.state.started && this.state.player_states.length > 0) {
      return (
        <span className="mb-3">
          {this.state.player_states.map((state, i) => (
            <PlayerState
              player={state["user"]["username"]}
              is_curr={state["user"]["username"] === this.state.curr_player}
              progress={this.getPlayerProgress(state)}
              score={0}
              ended={game_ended}
              color={(i + rand_num) % 6}
            />
          ))}
        </span>
      );
    } else {
      return (
        <span className="text mb-3">
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
    return (
      <Typing
        heading="Race"
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
        ended={this.state.game_ended}
        is_solo={false}
        cannot_type={!this.state.typing}
        wpm={this.state.curr_player_score["speed"]}
        accuracy={this.state.curr_player_score["acc"]}
        code_length={getCodeLength(this.state.code)}
        getTopText={this.getTopText}
        reset={() => null}
        getCode={() => null}
        backToWaiting={this.backToWaitingRoom}
        handleSubmit={this.handleSubmit}
        handleInputChange={this.handleInputChange}
        setRef={(input) => {
          this.text_input = input;
        }}
      />
    );
  }
}

export default Race;
