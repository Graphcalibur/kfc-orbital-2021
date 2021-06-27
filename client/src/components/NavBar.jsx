import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Navbar, Nav } from "react-bootstrap";

import Login from "./Login";
import SignUp from "./SignUp";

/* TODO: Re-implement reloading page after logging in when the server-
side storage becomes a thing */

class NavBar extends Component {
  state = {
    show_login: false,
    show_sign_up: false,
    curr_user: null,
  };

  /* Get logged in user when the component first appears */
  componentDidMount() {
    this.props.socket.emit("check-current-login");
    fetch("/api/current-login", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const new_curr_user = data === null ? data : data["username"];
        this.setState({ curr_user: new_curr_user });
      });
  }

  /* Logs out and refreshes the page */
  logout = () => {
    this.props.socket.emit("logout-ws");

    fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      /* window.location.reload(); */
      this.setState({ curr_user: null });
    });
  };

  /* Returns username and Logout button if a user if logged in, or
  Login and Sign Up buttons if no user is logged in. */
  getLoginButtons = () => {
    return this.state.curr_user === null ? (
      <Nav className="ms-auto">
        <Button
          variant="outline-primary"
          onClick={() => this.setState({ show_login: true })}
          className="me-3"
        >
          Login
        </Button>
        <Button
          variant="outline-primary"
          onClick={() => this.setState({ show_sign_up: true })}
        >
          Sign Up
        </Button>
      </Nav>
    ) : (
      <Nav className="ms-auto">
        <Link className="nav-link" to={"/user/" + this.state.curr_user}>
          {this.state.curr_user}
        </Link>
        <Button variant="outline-primary" onClick={() => this.logout()}>
          Logout
        </Button>
      </Nav>
    );
  };

  /* Only necessary until server-side storage gets implemented */
  updateCurrUser = (user) => {
    this.setState({ curr_user: user });
  };

  render() {
    return (
      <Navbar variant="dark" bg="dark" expand="sm" className="mb-3">
        <Container fluid>
          <Link className="navbar-brand" to="/">
            CodeRacer
          </Link>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav>
              <Link className="nav-link" to="/">
                Home
              </Link>
              <Link className="nav-link" to="/rooms">
                Race
              </Link>
              <Link className="nav-link" to="/lang">
                Practice
              </Link>
            </Nav>

            {this.getLoginButtons()}

            <Login
              show={this.state.show_login}
              close={() => this.setState({ show_login: false })}
              socket={this.props.socket}
              updateCurrUser={this.updateCurrUser}
            />
            <SignUp
              show={this.state.show_sign_up}
              close={() => this.setState({ show_sign_up: false })}
              socket={this.props.socket}
              updateCurrUser={this.updateCurrUser}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavBar;
