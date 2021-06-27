import React from "react";
import { Container, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

// TODO: Show "Log in to update your stats" if user is not logged in

const TypingStats = (props) => {
  /* Show no stats if typing test hasn't ended */
  if (!props.ended) return <span></span>;

  const { accuracy, wpm } = props;
  const history = useHistory();

  const getButtons = () => {
    if (props.is_solo) {
      return (
        <span>
          <Button
            onClick={props.reset}
            variant="outline-primary"
            className="me-4"
          >
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
        </span>
      );
    } else {
      return (
        <span>
          <Button
            onClick={() => props.back_to_waiting(history)}
            variant="outline-primary"
            className="me-4"
          >
            Back to Waiting Room
          </Button>

          <Button
            onClick={() => history.push(`/rooms`)}
            variant="outline-primary"
          >
            Back to Room List
          </Button>
        </span>
      );
    }
  };

  return (
    <Container fluid="sm" className="shadow p-3 gap-3 mt-3 box">
      <h3 className="text">Your Typing Stats:</h3>

      <p className="text" id="stats">
        Accuracy: {accuracy}% <br />
        Speed: {wpm} WPM
      </p>

      {getButtons()}
    </Container>
  );
};

export default TypingStats;
