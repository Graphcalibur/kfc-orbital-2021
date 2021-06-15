import React from "react";
import Timer from "./Timer";
import { create } from "react-test-renderer";

describe("Testing Timer component in page SoloTyping", () => {
  test("Test 1: Mins < 10, Seconds < 10, Not typing", () => {
    const tree = create(<Timer elapsed_time={1000} typing={false} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 2: Mins < 10, Seconds < 10, Typing", () => {
    const tree = create(<Timer elapsed_time={2000} typing={true} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 3: Mins < 10, Seconds >= 10, Not typing", () => {
    const tree = create(<Timer elapsed_time={12000} typing={false} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 4: Mins < 10, Seconds >= 10, Typing", () => {
    const tree = create(<Timer elapsed_time={12000} typing={true} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 5: Mins >= 10, Seconds < 10, Not typing", () => {
    const tree = create(<Timer elapsed_time={660000} typing={false} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 6: Mins >= 10, Seconds < 10, Typing", () => {
    const tree = create(<Timer elapsed_time={660000} typing={true} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 7: Mins >= 10, Seconds >= 10, Not typing", () => {
    const tree = create(<Timer elapsed_time={680000} typing={false} />);
    expect(tree).toMatchSnapshot();
  });
  test("Test 8: Mins >= 10, Seconds >= 10, Typing", () => {
    const tree = create(<Timer elapsed_time={680000} typing={false} />);
    expect(tree).toMatchSnapshot();
  });
});
