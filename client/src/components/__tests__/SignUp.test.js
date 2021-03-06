import React from "react";
import SignUp from "../SignUp";
import { shallow } from "enzyme";

const setup = () => {
  const wrapper = shallow(<SignUp show={true} />);

  return {
    wrapper: wrapper,
    password: wrapper.find("#password"),
    confirm: wrapper.find("#confirm"),
  };
};

describe("Testing SignUp component", () => {
  test("Test 1: Check validity if password and confirm password don't match", () => {
    let { wrapper, password, confirm } = setup();
    password.simulate("change", { target: { value: "lol" } });
    confirm.simulate("change", { target: { value: "lol" } });

    expect(wrapper.exists("p")).toEqual(false);

    password.simulate("change", { target: { value: "rofl" } });

    expect(wrapper.exists("p")).toEqual(true);
  });
});
