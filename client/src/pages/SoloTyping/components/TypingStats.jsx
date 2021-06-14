import React from "react";
import { Container, Button } from "react-bootstrap";

const TypingStats = (props) => {
  /* Show no stats if typing test hasn't ended */
  if (!props.ended) return <span></span>;

  const { accuracy, wpm } = props;

  return (
    <Container fluid="sm" className="shadow p-3 gap-3 mt-3 box">
      <h3 className="text">Your Typing Stats:</h3>

      <p className="text">
        Accuracy: {accuracy}% <br />
        Speed: {wpm} WPM
      </p>

      <Button onClick={props.reset} variant="outline-primary" className="me-4">
        Try Again
      </Button>

      <Button
        onClick={() => {
          props.getCode();
          props.reset();
        }}
        variant="outline-primary"
        className="me-4"
      >
        New Practice
      </Button>
    </Container>
  );
};

export default TypingStats;
