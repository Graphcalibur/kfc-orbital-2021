import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Navbar, Nav } from "react-bootstrap";

import Login from "./Login";
import SignUp from "./SignUp";

class NavBar extends Component {
  state = {
    show_login: false,
    show_sign_up: false,
    curr_user: null,
  };

  /* Get logged in user when the component first appears */
  componentDidMount() {
    fetch("http://localhost:9000/api/current-login", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const new_curr_user = data === null ? data : data["username"];
        console.log(new_curr_user);
        this.setState({ curr_user: new_curr_user });
      });
  }

  /* Logs out and refreshes the page */
  logout = () => {
    fetch("http://localhost:9000/api/logout", {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      window.location.reload();
    });
  };

  /* Returns username and Logout button if a user if logged in, or
  Login and Sign Up buttons if no user is logged in. */
  getLoginButtons = () => {
    return this.state.curr_user === null ? (
      <Nav className="ms-auto">
        <Button
          variant="primary"
          onClick={() => this.setState({ show_login: true })}
          className="me-3"
        >
          Login
        </Button>
        <Button
          variant="primary"
          onClick={() => this.setState({ show_sign_up: true })}
        >
          Sign Up
        </Button>
      </Nav>
    ) : (
      <Nav className="ms-auto">
        <Link className="nav-link" to="/">
          {this.state.curr_user}
        </Link>
        <Button variant="primary" onClick={() => this.logout()}>
          Logout
        </Button>
      </Nav>
    );
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
              <Link className="nav-link" to="/lang">
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
            />
            <SignUp
              show={this.state.show_sign_up}
              close={() => this.setState({ show_sign_up: false })}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavBar;
