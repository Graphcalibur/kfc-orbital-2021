import React from "react";
import Home from "../Home";
import { shallow } from "enzyme";

const setup = (scorelist) => {
  Home.prototype.componentDidMount = () => null;

  const wrapper = shallow(<Home />);

  const instance = wrapper.instance();
  instance.generateLeaderboard(scorelist);

  return { wrapper, leaderboard: instance.state.leaderboard };
};

describe("Testing Home page", () => {
  test("Test 1: Test that leaderboard is empty when no user has >= 5 plays", () => {
    const { leaderboard } = setup([
      { username: "a", speed: 100 },
      { username: "a", speed: 99 },
      { username: "a", speed: 98 },
      { username: "a", speed: 97 },
    ]);

    expect(leaderboard.length).toEqual(0);
  });

  test("Test 2: Test leaderboard with one user with >= 5 plays", () => {
    const { leaderboard } = setup([
      { username: "a", speed: 100 },
      { username: "a", speed: 99 },
      { username: "a", speed: 98 },
      { username: "a", speed: 97 },
      { username: "a", speed: 96 },
    ]);

    expect(leaderboard[0]["username"]).toEqual("a");
    expect(leaderboard[0]["speed"]).toEqual(98);
  });

  test("Test 3: Test leaderboard with multiple user with >= 5 plays", () => {
    const { leaderboard } = setup([
      { username: "a", speed: 100 },
      { username: "a", speed: 99 },
      { username: "a", speed: 98 },
      { username: "a", speed: 97 },
      { username: "a", speed: 96 },
      { username: "b", speed: 101 },
      { username: "b", speed: 100 },
      { username: "b", speed: 99 },
      { username: "b", speed: 98 },
      { username: "b", speed: 97 },
    ]);

    expect(leaderboard[0]["username"]).toEqual("b");
    expect(leaderboard[0]["speed"]).toEqual(99);
    expect(leaderboard[1]["username"]).toEqual("a");
    expect(leaderboard[1]["speed"]).toEqual(98);
  });
});
