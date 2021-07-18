import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import CreateRoom from "./components/CreateRoom";
import Filters from "./components/Filters";
import Room from "./components/Room";

class Rooms extends Component {
  state = {
    rooms: [],
    refresh_timer: null,
  };

  /* When component mounts, set socket to listen to list of rooms,
  and start the timer to periodically update lsit of rooms */
  componentDidMount() {
    this.props.socket.on("list-rooms-return", (rooms) => {
      this.setState({ rooms: rooms });
    });

    this.props.socket.on("create-room-return", (code) => {
      this.joinRoom(code["room_code"]);
    });

    const timer = setInterval(() => {
      this.getRooms();
    }, 200);

    this.setState({ refresh_timer: timer });
  }

  /* When component unmounts, stop the timer */
  componentWillUnmount() {
    clearInterval(this.state.refresh_timer);

    this.props.socket.removeAllListeners("list-rooms-return");
    this.props.socket.removeAllListeners("create-room-return");
  }

  getRooms = () => {
    this.props.socket.emit("list-rooms", "PLACEHOLDER");
  };

  createRoom = () => {
    this.props.socket.emit("create-room");
  };

  joinRoom = (code) => {
    this.props.socket.emit("join-room", { room_code: code });
    this.props.history.push(`/waitingroom`);
  };

  displayRooms = () => {
    const { rooms } = this.state;
    return rooms.length === 0 ? (
      <span className="text">
        Looks like there currently aren't any rooms. Why not create a new one?
      </span>
    ) : (
      rooms.map((room) => (
        <Room
          code={room["room_code"]}
          players={room["players"]}
          key={room["room_code"]}
          joinRoom={() => {
            this.joinRoom(room["room_code"]);
          }}
        />
      ))
    );
  };

  render() {
    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Racing Rooms Listing</b>
        </h1>

        <Row className="mt-3">
          <Col md="7">{this.displayRooms()}</Col>
          <Col md="4" className="ms-5">
            <Filters />
            <CreateRoom createRoom={this.createRoom} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Rooms);
