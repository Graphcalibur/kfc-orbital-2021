import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import LeaderboardSpot from "./LeaderboardSpot";

const Leaderboard = (props) => {
  const { leaderboard } = props;

  return (
    <Container className="p-3 box">
      <h3 className="text">
        <b>Leaderboard</b>
      </h3>

      {leaderboard.length === 0 ? (
        <p className="text">
          Looks like no one has done enough races today to qualify for the
          leaderboard. Perhaps you can snag the top spot!
        </p>
      ) : (
        <span>
          <Row className="text">
            <Col md="2">
              <b>Rank</b>
            </Col>
            <Col md="6">
              <b>Username</b>
            </Col>
            <Col md="4">
              <b>Speed</b>
            </Col>
          </Row>

          {leaderboard.map((spot, i) => (
            <LeaderboardSpot
              key={i}
              rank={i + 1}
              name={spot["username"]}
              speed={spot["speed"]}
            />
          ))}
        </span>
      )}
    </Container>
  );
};

export default Leaderboard;
