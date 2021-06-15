import React from "react";
import ChooseLanguage from "./ChooseLanguage";
import { create } from "react-test-renderer";

describe("Testing ChooseLanguage Page", () => {
  test("Test 1", () => {
    const tree = create(<ChooseLanguage />);
    expect(tree).toMatchSnapshot();
  });
});
