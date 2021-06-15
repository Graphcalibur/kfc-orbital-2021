import React from "react";
import TypingStats from "./TypingStats";
import { create } from "react-test-renderer";

describe("Testing TypingStats component in page SoloTyping", () => {
  test("Test 1: Not ended", () => {
    const tree = create(<TypingStats ended={false} accuracy={100} wpm={42} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 2: Ended", () => {
    const tree = create(<TypingStats ended={false} accuracy={80} wpm={64.4} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 3: Ended", () => {
    const tree = create(<TypingStats ended={false} accuracy={92.3} wpm={71} />);
    expect(tree).toMatchSnapshot();
  });
});
