import React from "react";
import SignUp from "./SignUp";
import { create } from "react-test-renderer";

describe("Testing SignUp component", () => {
  test("Test 1: Not shown", () => {
    const tree = create(<SignUp show={false} close={() => null} />);
    expect(tree).toMatchSnapshot();
  });

  test("Test 2: Test validation with empty at least one empty field", () => {
    const tree = create(<SignUp show={true} close={() => null} />);

    /* Test username filled, rest empty */
    const instance = tree.getInstance();
    instance.setState({ username: "test", validated: true });
    expect(tree.toJSON()).toMatchSnapshot();

    /* Test password and confirm_password filled, rest empty */
    instance.setState({
      username: "",
      password: "test",
      confirm_password: "test",
      validated: true,
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("Test 3: Test validation with filled in fields but different password and confirm_password", () => {
    const tree = create(<SignUp show={true} />);
    const instance = tree.getInstance();
    instance.setState({
      username: "test",
      password: "testtest",
      confirm_password: "doy",
      validated: true,
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("Test 4:  Test validation with all fields valid except for email", () => {
    const tree = create(<SignUp show={true} />);
    const instance = tree.getInstance();
    instance.setState({
      username: "test",
      email: "lol",
      password: "testtest",
      confirm_password: "testtest",
      validated: true,
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("Test 5:  Test validation with all fields valid, email empty", () => {
    const tree = create(<SignUp show={true} />);
    const instance = tree.getInstance();
    instance.setState({
      username: "test",
      password: "testtest",
      confirm_password: "testtest",
      validated: true,
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("Test 6:  Test validation with all fields valid and email filled in", () => {
    const tree = create(<SignUp show={true} />);
    const instance = tree.getInstance();
    instance.setState({
      username: "test",
      email: "lol@gmail.com",
      password: "testtest",
      confirm_password: "testtest",
      validated: true,
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("Test 7:  Test validation with failed sign up", () => {
    const tree = create(<SignUp show={true} />);
    const instance = tree.getInstance();
    instance.setState({
      username: "test",
      email: "lol@gmail.com",
      password: "testtest",
      confirm_password: "testtest",
      validated: true,
      failed_sign_up: 1,
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
