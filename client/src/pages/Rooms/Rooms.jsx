import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import socketIOClient from "socket.io-client";

import CreateRoom from "./components/CreateRoom";
import Filters from "./components/Filters";
import Room from "./components/Room";

const socket = socketIOClient("http://localhost:9000", {
  transports: ["websocket"],
});

class Rooms extends Component {
  state = {
    rooms: [],
  };

  getRooms = () => {
    socket.emit("list-rooms", "PLACEHOLDER");
  };

  createRoom = () => {
    socket.emit("create-room");
  };

  componentDidMount = () => {
    socket.on("list-rooms-return", (rooms) => {
      this.setState({ rooms: rooms });
      console.log(rooms);
    });

    setInterval(() => {
      this.getRooms();
    }, 200);
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
