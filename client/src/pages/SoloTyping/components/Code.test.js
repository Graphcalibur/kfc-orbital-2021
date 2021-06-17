import React from "react";
import Code from "./Code";
import { create } from "react-test-renderer";

describe("Testing Code component in page SoloTyping", () => {
  test("Test 1: Python Code, no wrong", () => {
    const tree = create(
      <Code
        code={[
          "for i in range(10):",
          '    print("number", i)',
          '    print("number squared": i ** 2)',
        ]}
        curr_line_num={2}
        first_wrong={6}
        curr_input_len={6}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  test("Test 2: Python Code, with wrong", () => {
    const tree = create(
      <Code
        code={[
          "for i in range(10):",
          '    print("number", i)',
          '    print("number squared": i ** 2)',
        ]}
        curr_line_num={2}
        first_wrong={3}
        curr_input_len={6}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  test("Test 3: C++ Code, with wrong", () => {
    const tree = create(
      <Code
        code={["for (int i = 0; i < 10; ++i)", "    cout << i << endl;", "}"]}
        curr_line_num={1}
        first_wrong={12}
        curr_input_len={12}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
  test("Test 3: C++ Code, with wrong", () => {
    const tree = create(
      <Code
        code={["for (int i = 0; i < 10; ++i)", "    cout << i << endl;", "}"]}
        curr_line_num={1}
        first_wrong={1}
        curr_input_len={12}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
