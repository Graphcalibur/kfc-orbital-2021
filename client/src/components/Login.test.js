import React from "react";
import Login from "./Login";
import { create } from "react-test-renderer";

describe("Testing Login component", () => {
  test("Test 1: Not shown", () => {
    const tree = create(<Login show={false} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("Test 2: Test validation with empty username or password fields", () => {
    const tree = create(<Login show={true} />);

    const instance = tree.getInstance();
    instance.setState({ username: "test", validated: true });
    expect(tree).toMatchSnapshot();

    instance.setState({ username: "", password: "test", validated: true });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("Test 3: Test validation with filled in username and password fields", () => {
    const tree = create(<Login show={true} />);
    const instance = tree.getInstance();
    instance.setState({
      username: "test",
      password: "testtest",
      validated: true,
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("Test 4: Test failed login", () => {
    const tree = create(<Login show={true} />);
    const instance = tree.getInstance();
    instance.setState({
      username: "test",
      password: "testtest",
      validated: true,
      failed_login: true,
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
