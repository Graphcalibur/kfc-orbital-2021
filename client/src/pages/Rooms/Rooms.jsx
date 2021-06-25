import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";

import CreateRoom from "./components/CreateRoom";
import Filters from "./components/Filters";
import Room from "./components/Room";

// TODO: Implement logging in

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

    /* For debugging purposes */
    this.props.socket.on("join-room-acknowledge", (rooms) => {
      console.log(rooms["user"]);
    });

    const timer = setInterval(() => {
      this.getRooms();
    }, 200);

    this.setState({ refresh_timer: timer });
  }

  /* When component unmounts, stop the timer */
  componentWillUnmount() {
    clearInterval(this.state.refresh_timer);
  }

  getRooms = () => {
    this.props.socket.emit("list-rooms", "PLACEHOLDER");
  };

  createRoom = () => {
    this.props.socket.emit("create-room");
  };

  joinRoom = (code) => {
    this.props.socket.emit("join-room", { room_code: code });
  };

  render() {
    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Racing Rooms</b>
        </h1>

        <Row className="mt-3">
          <Col md="8">
            {this.state.rooms.map((room) => (
              <Room
                code={room["room_code"]}
                players={room["players"]}
                key={room["room_code"]}
                joinRoom={this.joinRoom}
              />
            ))}
          </Col>
          <Col md="4">
            <Filters />
            <CreateRoom createRoom={this.createRoom} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Rooms;
