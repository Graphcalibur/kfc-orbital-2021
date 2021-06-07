import React, { Component } from "react";
import { Button, Form, Modal } from "react-bootstrap";

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    validated: false,
    failed_sign_up: false,
  };

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleConfirmChange = (event) => {
    this.setState({ confirm_password: event.target.value });
  };

  /* Checks if all input fields in the form are valid and if so,
  attempts to register the user. */
  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });

    if (
      !form.checkValidity() ||
      this.state.password !== this.state.confirm_password
    )
      return;

    this.registerUser();
  };

  /* Registers the user. If sign up was successful, then it automatically
  logins the user and refreshes the page. Otherwise, it triggers the
  failed sign up message. */
  registerUser = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    };

    const requestOptions2 = {
      ...requestOptions,
      credentials: "include",
    };

    /* Automatically logs the user in after successful sign up. If sign up is
      not successful, displays an error message */
    fetch("/api/register", requestOptions).then((res) => {
      if (res.status !== 409) {
        fetch("/api/authuser", requestOptions2).then((res) => {
          window.location.reload();
        });
      } else {
        this.setState({ failed_sign_up: true });
      }
    });
  };

  failedSignUpText = () => {
    return this.state.failed_sign_up ? (
      <p style={{ fontSize: "80%", color: "#ff1a1a" }}>
        Sign up has failed. Someone with that username already exists. Please
        choose a different username.
      </p>
    ) : (
      <></>
    );
  };

  render() {
    const { password, confirm_password } = this.state;
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.close}
        backdrop="static"
        keyboard={false}
        className="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.state.registered ? "You have signed up!" : "Sign Up"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
          >
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                required
                placeholder="Username"
                value={this.state.username}
                onChange={(event) => this.handleUsernameChange(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid username.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email (Optional)</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={this.state.email}
                onChange={(event) => this.handleEmailChange(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => this.handlePasswordChange(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid password.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirm" id="confirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Confirm Password"
                value={confirm_password}
                onChange={(event) => this.handleConfirmChange(event)}
                isInvalid={password !== confirm_password}
              />
              <Form.Control.Feedback type="invalid">
                This must be the same as your password.
              </Form.Control.Feedback>
            </Form.Group>

            {this.failedSignUpText()}

            <Button variant="primary" type="submit" className="float-end">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default SignUp;
