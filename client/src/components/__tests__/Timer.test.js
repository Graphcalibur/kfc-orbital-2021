import React from "react";
import Timer from "../Timer";
import { shallow } from "enzyme";

const setup = (time, ended, started) => {
  const wrapper = shallow(
    <Timer elapsed_time={time} ended={ended} started={started} />
  );

  return {
    wrapper,
    time: wrapper.find(".time"),
  };
};

describe("Testing Timer component in page SoloTyping", () => {
  test("Test 1: Mins < 10, Seconds < 10, Not ended and not started", () => {
    const { time, color } = setup(1000, false, false);
    expect(time.text()).toEqual("00:01");
    expect(time.prop("style")).toHaveProperty("color", "#AAAAAA");
  });
  test("Test 2: Mins < 10, Seconds < 10, Not ended but started", () => {
    const { time, color } = setup(1000, false, true);
    expect(time.text()).toEqual("00:01");
    expect(time.prop("style")).toHaveProperty("color", "#FFFFFF");
  });
  test("Test 3: Mins < 10, Seconds < 10, Ended", () => {
    const { time, color } = setup(1000, true, true);
    expect(time.text()).toEqual("00:01");
    expect(time.prop("style")).toHaveProperty("color", "#00e600");
  });
  test("Test 4: Mins < 10, Seconds >= 10, Not ended and not started", () => {
    const { time, color } = setup(12000, false, false);
    expect(time.text()).toEqual("00:12");
    expect(time.prop("style")).toHaveProperty("color", "#AAAAAA");
  });
  test("Test 5: Mins < 10, Seconds >= 10, Not ended but started", () => {
    const { time, color } = setup(12000, false, true);
    expect(time.text()).toEqual("00:12");
    expect(time.prop("style")).toHaveProperty("color", "#FFFFFF");
  });
  test("Test 6: Mins < 10, Seconds >= 10, Ended", () => {
    const { time, color } = setup(12000, true, true);
    expect(time.text()).toEqual("00:12");
    expect(time.prop("style")).toHaveProperty("color", "#00e600");
  });
  test("Test 7: Mins >= 10, Seconds < 10, Not ended and not started", () => {
    const { time, color } = setup(661000, false, false);
    expect(time.text()).toEqual("11:01");
    expect(time.prop("style")).toHaveProperty("color", "#AAAAAA");
  });
  test("Test 8: Mins >= 10, Seconds < 10, Not ended but started", () => {
    const { time, color } = setup(661000, false, true);
    expect(time.text()).toEqual("11:01");
    expect(time.prop("style")).toHaveProperty("color", "#FFFFFF");
  });
  test("Test 9: Mins >= 10, Seconds < 10, Ended", () => {
    const { time, color } = setup(661000, true, true);
    expect(time.text()).toEqual("11:01");
    expect(time.prop("style")).toHaveProperty("color", "#00e600");
  });
  test("Test 10: Mins >= 10, Seconds >= 10, Not ended and not started", () => {
    const { time, color } = setup(680000, false, false);
    expect(time.text()).toEqual("11:20");
    expect(time.prop("style")).toHaveProperty("color", "#AAAAAA");
  });
  test("Test 11: Mins >= 10, Seconds >= 10, Not ended but started", () => {
    const { time, color } = setup(680000, false, true);
    expect(time.text()).toEqual("11:20");
    expect(time.prop("style")).toHaveProperty("color", "#FFFFFF");
  });
  test("Test 12: Mins >= 10, Seconds >= 10, Ended", () => {
    const { time, color } = setup(680000, true, true);
    expect(time.text()).toEqual("11:20");
    expect(time.prop("style")).toHaveProperty("color", "#00e600");
  });
});
