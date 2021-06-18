import "jsdom-global/register";
import React from "react";
import ChooseLanguage from "../ChooseLanguage";
import { mount } from "enzyme";

describe("Testing ChooseLanguage Page", () => {
  test("Test 1", () => {
    const wrapper = mount(<ChooseLanguage />);
    expect(wrapper.find("#Python").text()).toEqual("Python");
  });
});
