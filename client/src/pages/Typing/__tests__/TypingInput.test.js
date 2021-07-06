import React from "react";
import TypingInput from "../components/TypingInput";
import { shallow } from "enzyme";

const setup = (is_wrong, curr_input, cannot_type) => {
  const wrapper = shallow(
    <TypingInput
      is_wrong={is_wrong}
      curr_input={curr_input}
      readOnly={cannot_type}
    />
  );

  return {
    wrapper,
    input: wrapper.find("input"),
  };
};

describe("Testing TypingInput component in page SoloTyping", () => {
  test("Test 1: Check style when it's wrong", () => {
    const { input } = setup(true, "", false);
    expect(input.prop("style")).toHaveProperty("backgroundColor", "#800000");
  });

  test("Test 2: Check style when it's correct", () => {
    const { input } = setup(false, "", false);
    expect(input.prop("style")).toHaveProperty("backgroundColor", "#233243");
  });
});
