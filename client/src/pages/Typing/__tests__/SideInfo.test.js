import React from "react";
import SideInfo from "../components/SideInfo";
import { shallow } from "enzyme";

const setup = (language, code_length, code_lines) => {
  const wrapper = shallow(
    <SideInfo
      language={language}
      code_length={code_length}
      code_lines={code_lines}
    />
  );

  return {
    wrapper,
    text: wrapper.find(".text"),
  };
};

describe("Testing SideInfo component in page SoloTyping", () => {
  test("Test 1", () => {
    const { text } = setup("Python", 80, 7);
    expect(text.text()).toEqual(
      "Language: PythonLength (Characters): 80Length (Lines): 7"
    );
  });

  test("Test 2", () => {
    const { text } = setup("C++", 1493, 46);
    expect(text.text()).toEqual(
      "Language: C++Length (Characters): 1493Length (Lines): 46"
    );
  });
});
