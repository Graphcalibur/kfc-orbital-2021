import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";

class Login extends Component {
  state = {
    username: "",
    password: "",
    validated: false,
  };

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
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
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.close}
        backdrop="static"
        keyboard={false}
        className="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
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
                Please enter your username.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={(event) => this.handlePasswordChange(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex align-items-center gap-3 float-end">
              <Link style={{ fontSize: "80%" }} to="/">
                Forgot password?
              </Link>

              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

export default Login;