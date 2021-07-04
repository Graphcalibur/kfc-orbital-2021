import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";

const Room = (props) => {
  const history = useHistory();

  const onClickJoinRoom = () => {
    props.joinRoom(props.code);
    history.push(`/waitingroom`);
  };

  return (
    <Row className="mb-3 p-2 box text align-items-center">
      <Col md="4">
        <b>Room Code: </b>
        {props.code}
      </Col>
      <Col md="5">
        <b>No. of Players: </b>
        {props.players.length}
      </Col>
      <Col md="3">
        <Button
          variant="outline-info"
          className="float-end"
          onClick={onClickJoinRoom}
        >
          Join Room
        </Button>
      </Col>
    </Row>
  );
};

export default Room;
