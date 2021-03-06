import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

import Player from "./components/Player";

class WaitingRoom extends Component {
  state = {
    refresh_timer: null,
    players: [],
    curr_player: "",
    keep_room: false,
  };

  /* When component mounts, set socket to listen for room status and 
  current login, start the refresh timer to periodically update room 
  status, and get current login */
  componentDidMount() {
    this.props.socket.on("get-room-status-return", (status) => {
      this.setState({ players: status["players"] });
    });

    this.props.socket.on("check-current-login-return", (player) => {
      if (player === null) return;
      this.setState({ curr_player: player["username"] });
    });

    this.props.socket.on("set-snippet", this.onSetSnippet);

    const timer = setInterval(() => {
      this.getRoomStatus();
    }, 200);

    this.props.socket.emit("check-current-login");

    this.setState({ refresh_timer: timer, keep_room: false });
  }

  /* Leave the room and stop the timer when component unmounts */
  componentWillUnmount() {
    if (!this.state.keep_room) this.leaveRoom();
    clearInterval(this.state.refresh_timer);

    this.props.socket.removeListener("set-snippet", this.onSetSnippet);
    this.props.socket.removeAllListeners("get-room-status-return");
    this.props.socket.removeAllListeners("check-current-login-return");
  }

  onSetSnippet = (player) => {
    this.setState({ keep_room: true });
    this.props.history.push(`/race`);
  };

  getRoomStatus = () => {
    this.props.socket.emit("get-room-status");
  };

  leaveRoom = () => {
    this.props.socket.emit("leave-room");
  };

  /* Check player's current status, then update it accordingly */
  changeStatus = () => {
    const { players } = this.state;
    let status = "";

    for (let i = 0; i < players.length && status === ""; i++) {
      if (players[i]["user"]["username"] === this.state.curr_player) {
        status = players[i]["status"];
      }
    }

    const new_status = status === "Ready" ? "Not Ready" : "Ready";
    this.props.socket.emit("set-player-status", { current_status: new_status });
  };

  getPlayerStatus = () => {
    if (this.state.players.length === 0) {
      return (
        <Row>
          <Col>You don't seem to be in a room.</Col>
        </Row>
      );
    } else {
      return (
        <span>
          {this.state.players.map((player) => (
            <Player
              name={player["user"]["username"]}
              status={player["status"]}
              key={player["user"]["username"]}
              is_curr={player["user"]["username"] === this.state.curr_player}
            />
          ))}
          <Row className="mt-3">
            <Col>
              You will automatically be redirected to the race when everyone is
              ready.
            </Col>
          </Row>
        </span>
      );
    }
  };

  render() {
    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Waiting Room</b>
        </h1>
        <Container className="p-3 box text">
          <Row>
            <Col md="3">
              <b>Player Name</b>
            </Col>
            <Col md="2">
              <b>Status</b>
            </Col>
            <Col md="7">
              <b>Room Code:</b> {this.props.room_code} (share this with others
              so they can join, too!)
            </Col>
          </Row>

          {this.getPlayerStatus()}

          <Button
            variant="outline-info"
            className="me-4 mt-3"
            onClick={this.changeStatus}
          >
            Ready/Unready
          </Button>

          <Link to={`/rooms`}>
            <Button
              variant="outline-info"
              onClick={this.leaveRoom}
              className="mt-3"
            >
              Leave Room
            </Button>
          </Link>
        </Container>
      </Container>
    );
  }
}

export default withRouter(WaitingRoom);
