import React from "react";
import { Button, Container } from "react-bootstrap";

const CreateRoom = (props) => {
  return (
    <Container className="text mt-3 mb-4 p-3 box">
      <h3 className>
        <b>Create Room</b>
      </h3>

      <p>
        Don't like any of the rooms you see? Click one of the buttons below to
        create a new room!
      </p>
      <Button variant="outline-info" onClick={props.createRoom}>
        Create Public Room
      </Button>
      <Button
        variant="outline-info"
        onClick={props.createRoom}
        className="ms-4"
      >
        Create Private Room
      </Button>
    </Container>
  );
};

export default CreateRoom;
