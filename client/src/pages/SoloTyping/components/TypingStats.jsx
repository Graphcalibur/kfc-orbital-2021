import React from 'react';
import { Container, Button } from "react-bootstrap";

const TypingStats = (props) => {
    /* Show no stats if typing test hasn't ended */
    if (!props.ended) return <></>;

    const { code, typed_wrong } = props;
    let code_length = 0;

    for (let i = 0; i < code.length; i++) {
      code_length += code[i].trim().length; /* Don't count starting whitespace */
    }

    /* Accuracy = (# of chars in code / # of chars typed including wrong) * 100
       Formula does * 1000 / 10 so that it's accurate to the first decimal place */
    const accuracy =
      Math.round((code_length / (typed_wrong + code_length)) * 1000) / 10;

    /* WPM = (# of chars in code / 5) / time in minutes */
    const wpm = Math.round(code_length / 5 / (props.elapsed_time / 60000));

    return (
      <Container fluid="sm" className="shadow p-3 gap-3 mt-3 box">
        <h3 className="text">Your Typing Stats:</h3>

        <p className="text">
          Accuracy: {accuracy}% <br />
          Speed: {wpm} WPM
        </p>

        <Button onClick={props.reset} variant="primary" className="me-4">
          Try Again
        </Button>

        <Button
          onClick={() => {props.getCode(); props.reset();}}
          variant="primary" className="me-4"
        >
          New Practice
        </Button>
      </Container>
    );
}

export default TypingStats;