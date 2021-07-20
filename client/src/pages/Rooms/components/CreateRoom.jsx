import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

const CreateRoom = (props) => {
  const [is_private, setPrivate] = useState(false);

  return (
    <Container className="text mt-3 mb-4 p-3 box">
      <h3>
        <b>Create Room</b>
      </h3>

      <p>
        Don't like any of the rooms you see? Click one of the buttons below to
        create a new room!
      </p>

      <Form.Check
        type="checkbox"
        label="Private Room (will not be visible in room list)"
        id="private"
        checked={is_private}
        onChange={() => {
          setPrivate(!is_private);
        }}
      />

      <Button
        variant="outline-info"
        onClick={() => {
          props.createRoom(is_private);
        }}
      >
        Create Room
      </Button>
    </Container>
  );
};

export default CreateRoom;
