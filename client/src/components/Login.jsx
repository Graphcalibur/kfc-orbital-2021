import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";

class Login extends Component {
  state = {
    username: "",
    password: "",
    validated: false,
    failed_login: 0,
  };

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  /* Checks if all input fields are valid and if so,
  attempts to login the user */
  handleSubmit = (event) => {
    const form = event.currentTarget;

    /* Stop form from reloading the page before updating
      necessary data */
    event.preventDefault();
    event.stopPropagation();

    /* Gets the form to check the validity of each input
    field */
    this.setState({ validated: true });

    if (!form.checkValidity()) return;

    this.loginUser();
  };

  /* Logs in the user and refrshes the page if it was successful,
  or triggers the failed login message if it is not. */
  loginUser = () => {
    this.props.socket.emit("login-ws", {
      username: this.state.username,
      password: this.state.password,
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    };

    fetch("/api/authuser", requestOptions).then((res) => {
      if (res.status === 200) {
        window.location.reload();
      } else if (res.status === 401) {
        this.setState({ failed_login: 1 });
      } else {
        this.setState({ failed_login: 2 });
      }
    });
  };

  failed_loginText = () => {
    if (this.state.failed_login === 1) {
      return (
        <p style={{ fontSize: "80%", color: "#ff1a1a" }}>
          Login has failed. Check that you typed your username and password
          correctly and try again.
        </p>
      );
    } else if (this.state.failed_login === 2) {
      return (
        <p style={{ fontSize: "80%", color: "#ff1a1a" }}>
          Login has failed. Please try again later.
        </p>
      );
    }

    return <span></span>;
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
                id="username"
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
                id="password"
                value={this.state.password}
                onChange={(event) => this.handlePasswordChange(event)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your password.
              </Form.Control.Feedback>
            </Form.Group>

            {this.failed_loginText()}

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
