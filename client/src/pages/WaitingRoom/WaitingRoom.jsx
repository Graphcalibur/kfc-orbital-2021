import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import Player from "./components/Player";

// TODO: Error handling if user goes into waitingroom without joining a room
// TODO: Improve layout

class WaitingRoom extends Component {
  state = {
    refresh_timer: null,
    players: [],
    curr_player: "",
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

    const timer = setInterval(() => {
      this.getRoomStatus();
    }, 200);

    this.props.socket.emit("check-current-login");

    this.setState({ refresh_timer: timer });
  }

  /* Leave the room and stop the timer when component unmounts */
  componentWillUnmount() {
    this.leaveRoom();
    clearInterval(this.state.refresh_timer);
  }

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

  render() {
    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Waiting Room</b>
        </h1>
        <Container className="shadow p-3 box text">
          <Row>
            <Col md="3">
              <b>Player Name</b>
            </Col>
            <Col md="9">
              <b>Status</b>
            </Col>
          </Row>

          {this.state.players.map((player) => (
            <Player
              name={player["user"]["username"]}
              status={player["status"]}
              key={player["user"]["username"]}
              is_curr={player["user"]["username"] === this.state.curr_user}
            />
          ))}

          <Button
            variant="outline-primary"
            className="me-4 mt-3"
            onClick={this.changeStatus}
          >
            Ready/Unready
          </Button>

          <Link to={`/rooms`}>
            <Button
              variant="outline-primary"
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

export default WaitingRoom;