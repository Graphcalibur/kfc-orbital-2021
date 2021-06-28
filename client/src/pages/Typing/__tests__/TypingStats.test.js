import React from "react";
import TypingStats from "../components/TypingStats";
import { shallow } from "enzyme";

const setup = (ended, accuracy, wpm) => {
  const wrapper = shallow(
    <TypingStats ended={ended} accuracy={accuracy} wpm={wpm} />
  );

  return {
    wrapper,
    exists: wrapper.exists("#stats"),
    stats: wrapper.find("#stats"),
  };
};

describe("Testing TypingStats component in page SoloTyping", () => {
  test("Test 1: Not ended", () => {
    const { exists, stats } = setup(false, 100, 42);
    expect(exists).toEqual(false);
  });
  test("Test 2: Ended", () => {
    const { exists, stats } = setup(true, 80, 64.4);
    expect(exists).toEqual(true);
    expect(stats.text()).toEqual("Accuracy: 80% Speed: 64.4 WPM");
  });
  test("Test 3: Ended", () => {
    const { exists, stats } = setup(true, 92.3, 71);
    expect(exists).toEqual(true);
    expect(stats.text()).toEqual("Accuracy: 92.3% Speed: 71 WPM");
  });
});
