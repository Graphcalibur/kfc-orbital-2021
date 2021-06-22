import "jsdom-global/register";
import React from "react";
import Code from "../components/Code";
import { mount } from "enzyme";

const setup = (code, curr_line_num, first_wrong, curr_input_len) => {
  const wrapper = mount(
    <Code
      code={code}
      curr_line_num={curr_line_num}
      first_wrong={first_wrong}
      curr_input_len={curr_input_len}
    />
  );

  const lines = code.map((code_line, i) =>
    wrapper.find("#line" + i.toString())
  );

  return { wrapper: wrapper, lines: lines };
};

const get_new_code = (code_line) => {
  return (
    "\u00a0".repeat(code_line.length - code_line.trim().length) +
    code_line.trim()
  );
};

describe("Testing Code component in page SoloTyping", () => {
  test("Test 1: Python Code, no wrong", () => {
    const code = [
      "for i in range(10):",
      '    print("number", i)',
      '    print("number squared": i ** 2)',
    ];
    const { wrapper, lines } = setup(code, 2, 6, 6);

    for (let i = 0; i < code.length; i++) {
      expect(lines[i].text()).toEqual(get_new_code(code[i]));
    }

    expect(lines[0].exists("#right")).toEqual(false);
    expect(lines[1].exists("#right")).toEqual(false);
    expect(lines[2].find("#right").text()).toEqual("print(");
    expect(lines[2].find("#wrong").text()).toEqual("");

    wrapper.unmount();
  });

  test("Test 2: Python Code, with wrong", () => {
    const code = [
      "for i in range(10):",
      '    print("number", i)',
      '    print("number squared": i ** 2)',
    ];
    const { wrapper, lines } = setup(code, 2, 3, 6);

    for (let i = 0; i < code.length; i++) {
      expect(lines[i].text()).toEqual(get_new_code(code[i]));
    }

    expect(lines[0].exists("#right")).toEqual(false);
    expect(lines[1].exists("#right")).toEqual(false);
    expect(lines[2].find("#right").text()).toEqual("pri");
    expect(lines[2].find("#wrong").text()).toEqual("nt(");

    wrapper.unmount();
  });

  test("Test 3: C++ Code, no wrong", () => {
    const code = [
      "for (int i = 0; i < 10; ++i)",
      "    cout << i << endl;",
      "}",
    ];
    const { wrapper, lines } = setup(code, 1, 12, 12);

    for (let i = 0; i < code.length; i++) {
      expect(lines[i].text()).toEqual(get_new_code(code[i]));
    }

    expect(lines[0].exists("#right")).toEqual(false);
    expect(lines[2].exists("#right")).toEqual(false);
    expect(lines[1].find("#right").text()).toEqual("cout << i <<");
    expect(lines[1].find("#wrong").text()).toEqual("");

    wrapper.unmount();
  });
  test("Test 4: C++ Code, with wrong", () => {
    const code = [
      "for (int i = 0; i < 10; ++i)",
      "    cout << i << endl;",
      "}",
    ];
    const { wrapper, lines } = setup(code, 1, 6, 12);

    for (let i = 0; i < code.length; i++) {
      expect(lines[i].text()).toEqual(get_new_code(code[i]));
    }

    expect(lines[0].exists("#right")).toEqual(false);
    expect(lines[2].exists("#right")).toEqual(false);
    expect(lines[1].find("#right").text()).toEqual("cout <");
    expect(lines[1].find("#wrong").text()).toEqual("< i <<");

    wrapper.unmount();
  });
});
