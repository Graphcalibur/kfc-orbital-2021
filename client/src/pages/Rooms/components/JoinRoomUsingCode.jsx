import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

const JoinRoomUsingCode = (props) => {
  const [text, setText] = useState("");

  return (
    <Container className="text mt-3 p-3 box">
      <h3>
        <b>Join Room Using Code</b>
      </h3>

      <p>
        If you want to join a private room or can't find the public room you're
        looking for, you can type in the room code below and click "Join Room".
      </p>

      <Form.Control
        className="input mb-3"
        placeholder="Type the room code here..."
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
      />

      <Button
        className="mb-2"
        variant="outline-info"
        onClick={() => {
          props.joinRoom(text);
        }}
      >
        Join Room
      </Button>

      {props.err_msg === "" ? (
        <span></span>
      ) : (
        <div style={{ fontSize: "80%", color: "#ff1a1a" }}>{props.err_msg}</div>
      )}
    </Container>
  );
};

export default JoinRoomUsingCode;
