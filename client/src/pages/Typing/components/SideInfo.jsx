import React from "react";
import { Button, Container, OverlayTrigger, Tooltip } from "react-bootstrap";

const SideInfo = (props) => {
  const popover = (
    <Tooltip>
      Type the code in each line and hit Enter when you reach the end. Any
      errors made will have to be backspaced and fixed before continuing. Timing
      begins when
      {props.is_solo ? " you start typing " : " the countdown finishes "}
      and ends after the last line.
    </Tooltip>
  );

  return (
    <Container className="p-3 ms-3 align-content-start box">
      <p className="text">
        <b>Language:</b> {props.language}
        <br />
        <b>Length (Characters):</b> {props.code_length}
        <br />
        <b>Length (Lines):</b> {props.code_lines}
      </p>

      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <Button variant="outline-info">Instructions</Button>
      </OverlayTrigger>
    </Container>
  );
};

export default SideInfo;
