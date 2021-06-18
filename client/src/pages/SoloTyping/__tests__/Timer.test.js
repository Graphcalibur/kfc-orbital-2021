import React from "react";
import Timer from "../components/Timer";
import { shallow } from "enzyme";

const setup = (time, typing) => {
  const wrapper = shallow(<Timer elapsed_time={time} typing={typing} />);

  return {
    wrapper,
    time: wrapper.find(".time"),
  };
};

describe("Testing Timer component in page SoloTyping", () => {
  test("Test 1: Mins < 10, Seconds < 10, Not typing", () => {
    const { time, color } = setup(1000, false);
    expect(time.text()).toEqual("00:01");
    expect(time.prop("style")).toHaveProperty("color", "#AAAAAA");
  });
  test("Test 2: Mins < 10, Seconds < 10, Typing", () => {
    const { time, color } = setup(1000, true);
    expect(time.text()).toEqual("00:01");
    expect(time.prop("style")).toHaveProperty("color", "#FFFFFF");
  });
  test("Test 3: Mins < 10, Seconds >= 10, Not typing", () => {
    const { time, color } = setup(12000, false);
    expect(time.text()).toEqual("00:12");
    expect(time.prop("style")).toHaveProperty("color", "#AAAAAA");
  });
  test("Test 4: Mins < 10, Seconds >= 10, Typing", () => {
    const { time, color } = setup(12000, true);
    expect(time.text()).toEqual("00:12");
    expect(time.prop("style")).toHaveProperty("color", "#FFFFFF");
  });
  test("Test 5: Mins >= 10, Seconds < 10, Not typing", () => {
    const { time, color } = setup(661000, false);
    expect(time.text()).toEqual("11:01");
    expect(time.prop("style")).toHaveProperty("color", "#AAAAAA");
  });
  test("Test 6: Mins >= 10, Seconds < 10, Typing", () => {
    const { time, color } = setup(661000, true);
    expect(time.text()).toEqual("11:01");
    expect(time.prop("style")).toHaveProperty("color", "#FFFFFF");
  });
  test("Test 7: Mins >= 10, Seconds >= 10, Not typing", () => {
    const { time, color } = setup(680000, false);
    expect(time.text()).toEqual("11:20");
    expect(time.prop("style")).toHaveProperty("color", "#AAAAAA");
  });
  test("Test 8: Mins >= 10, Seconds >= 10, Typing", () => {
    const { time, color } = setup(680000, true);
    expect(time.text()).toEqual("11:20");
    expect(time.prop("style")).toHaveProperty("color", "#FFFFFF");
  });
});
