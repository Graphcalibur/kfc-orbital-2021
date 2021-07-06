import "jsdom-global/register";
import React from "react";
import Rooms from "../Rooms";
import { mount } from "enzyme";

const setup = () => {
  Rooms.prototype.componentDidMount = () => {
    return 0;
  };

  const wrapper = mount(<Rooms />);
  const instance = wrapper.instance();

  return {
    wrapper: wrapper,
  };
};

describe("Testing whole Rooms page", () => {
  const { wrapper } = setup();

  test("Test 1: Check text displayed when # of rooms at start is 0 ", () => {
    expect(wrapper.exists("Room")).toEqual(false);
    expect(wrapper.exists("span")).toEqual(true);
  });
});
