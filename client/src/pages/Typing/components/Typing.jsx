import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../Typing.css";
import Code from "./Code";
import SideInfo from "./SideInfo";
import TypingStats from "./TypingStats";
import Timer from "../../../components/Timer";
import TypingInput from "./TypingInput";

const Typing = (props) => {
  const { curr_input } = props;

  const back_btn = props.is_solo ? (
    <Link to={`/lang`}>
      <Button variant="outline-info">Back to Language Selection</Button>
    </Link>
  ) : (
    <Link to={`/rooms`}>
      <Button variant="outline-info">Leave Race</Button>
    </Link>
  );

  return (
    <Container fluid="lg">
      <h1 className="text">
        <b>{props.heading}</b>
      </h1>

      {props.getTopText()}

      <Row className="mt-3">
        <Col md="9">
          <Container className="p-3 box">
            <Timer
              elapsed_time={props.elapsed_time}
              ended={props.ended}
              started={props.started}
            />

            <Code
              code={props.code}
              curr_line_num={props.curr_line_num}
              first_wrong={props.first_wrong}
              curr_input_len={curr_input.length}
            />

            <TypingInput
              is_wrong={props.first_wrong < curr_input.length}
              curr_input={curr_input}
              cannot_type={props.cannot_type}
              handleSubmit={props.handleSubmit}
              handleInputChange={props.handleInputChange}
              setRef={props.setRef}
            />

            {back_btn}
          </Container>

          <TypingStats
            ended={props.ended}
            wpm={props.wpm}
            accuracy={props.accuracy}
            reset={props.reset}
            getCode={props.getCode}
            backToWaiting={props.backToWaiting}
            is_solo={props.is_solo}
          />
        </Col>

        <Col md="3">
          <SideInfo
            language={props.language}
            code_length={props.code_length}
            code_lines={props.code.length}
            is_solo={props.is_solo}
          />
          <span></span>
        </Col>
      </Row>
    </Container>
  );
};

export default Typing;
