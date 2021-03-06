import React from "react";
import SoloTyping from "../SoloTyping";
import { shallow } from "enzyme";

/* Functions that can't be tested:
- startTyping() - activating the timer causes the Github CI to never end
- componentDidMount() - fetch function is not recognized
- stopTyping() - fetch function is not recognized
- reset() - this.text_input is not recognized
*/

const setup = () => {
  SoloTyping.WrappedComponent.prototype.componentDidMount = () => null;

  const wrapper = shallow(
    <SoloTyping.WrappedComponent match={{ params: { lang: "Python" } }} />
  );

  return {
    wrapper: wrapper,
    instance: wrapper.instance(),
    input: wrapper.find("Typing"),
  };
};

describe("Testing whole SoloTyping page", () => {
  const code = [
    "for i in range(10):",
    '    print("number", i)',
    '    print("number squared": i ** 2)',
  ];

  test("Test 1: Testing initial state", () => {
    const { instance } = setup();

    expect(instance.state).toEqual({
      code: [""],
      language: "",
      id: -1,

      curr_line_num: 0,
      curr_input: "",

      first_wrong: 0,
      typed_wrong: 0,

      typing: false,
      started: false,

      error: false,

      start_time: 0,
      elapsed_time: 0,
      timer: null,

      rand_num: instance.state.rand_num,
    });
  });

  test("Test 2: Getting errors in first line", () => {
    const { wrapper, instance, input } = setup();
    instance.setState({
      code: code,
      language: "Python",
      typing: true,
      started: true,
    });

    const to_type = ["f", "fo", "fol", "fol ", "fol i"];
    for (let i = 0; i < to_type.length; i++) {
      instance.handleInputChange({ target: { value: to_type[i] } });
    }

    /* Have to update inpput to get the new style */
    const updated_input = wrapper.find("Typing");

    expect(instance.state.curr_input).toEqual("fol i");
    expect(instance.state.first_wrong).toEqual(2);
    expect(instance.state.typed_wrong).toEqual(3);
    expect(
      instance.state.first_wrong < instance.state.curr_input.length
    ).toEqual(true);
  });

  test("Test 3: Get first line correct and get errors on second line", () => {
    const { wrapper, instance, input } = setup();
    instance.setState({
      code: code,
      language: "Python",
      typing: true,
      started: true,
    });

    /* Get first line correct */
    for (let i = 1; i <= code[0].length; i++) {
      instance.handleInputChange({
        target: { value: code[0].substring(0, i) },
      });
    }

    let updated_input = wrapper.find("Typing");

    expect(instance.state.curr_input).toEqual("for i in range(10):");
    expect(instance.state.first_wrong).toEqual(19);
    expect(instance.state.typed_wrong).toEqual(0);
    expect(
      instance.state.first_wrong < instance.state.curr_input.length
    ).toEqual(false);

    /* Hit enter to go to second line */
    instance.handleSubmit({ key: "Enter" });

    expect(instance.state.curr_input).toEqual("");
    expect(instance.state.curr_line_num).toEqual(1);
    expect(instance.state.first_wrong).toEqual(0);
    expect(instance.state.typed_wrong).toEqual(0);

    /* Get second line wrong */
    instance.handleInputChange({
      target: { value: "z" },
    });
    updated_input = wrapper.find("Typing");

    expect(instance.state.curr_input).toEqual("z");
    expect(instance.state.first_wrong).toEqual(0);
    expect(instance.state.typed_wrong).toEqual(1);
    expect(
      instance.state.first_wrong < instance.state.curr_input.length
    ).toEqual(true);
  });

  test("Test 4: Test getWPM and getAccuracy", () => {
    const { wrapper, instance, input } = setup();
    instance.setState({
      code: code,
      language: "Python",
      elapsed_time: 30000,
      typed_wrong: 2,
    });

    expect(instance.getWPM()).toEqual(27);
    expect(instance.getAccuracy()).toEqual(97.1);
  });
});
