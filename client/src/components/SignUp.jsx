import React, { Component } from "react";
import { Button, Form, Modal } from "react-bootstrap";

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    validated: false,
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

  handleSubmit = (event) => {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({ validated: true });
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
          <Modal.Title>Sign Up</Modal.Title>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
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

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Confirm Password"
                value={confirm_password}
                onChange={(event) => this.handleConfirmChange(event)}
                isValid={
                  confirm_password !== "" && password === confirm_password
                }
              />
              <Form.Control.Feedback type="invalid">
                This must be the same as your password.
              </Form.Control.Feedback>
            </Form.Group>

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
