import React from "react";
import { Button, Container } from "react-bootstrap";

const CreateRoom = (props) => {
  return (
    <Container className="mt-3 p-3 box">
      <p className="text">
        Don't like any of the rooms you see? Click the button below to create a
        new room!
      </p>
      <Button variant="outline-primary" onClick={props.createRoom}>
        Create Room
      </Button>
    </Container>
  );
};

export default CreateRoom;
