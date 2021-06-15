import React from "react";
import Header from "./Header";
import { create } from "react-test-renderer";

describe("Testing Header component in page SoloTyping", () => {
  test("Test 1", () => {
    const tree = create(
      <Header language={"Python"} code_length={80} code_lines={7} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  test("Test 2", () => {
    const tree = create(
      <Header language={"C++"} code_length={6931} code_lines={314} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
