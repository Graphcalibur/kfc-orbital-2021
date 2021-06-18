import React from "react";
import { Button, Container, OverlayTrigger, Tooltip } from "react-bootstrap";

const Header = (props) => {
  const popover = (
    <Tooltip className="tooltip">
      Type the code in each line and hit Enter when you reach the end. If you
      make any errors, you'll have to backspace and fix them before continuing.
      Timing begins when you start typing and ends after the last line.
    </Tooltip>
  );

  return (
    <Container className="shadow p-3 ms-3 align-content-start box">
      <p className="text">
        <b>Language:</b> {props.language}
        <br />
        <b>Length (Characters):</b> {props.code_length}
        <br />
        <b>Length (Lines):</b> {props.code_lines}
      </p>

      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <Button variant="outline-primary" className="howToPlay">
          How to Play
        </Button>
      </OverlayTrigger>
    </Container>
  );
};

export default Header;
