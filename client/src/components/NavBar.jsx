import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Navbar, Nav } from "react-bootstrap";

import Login from "./Login";
import SignUp from "./SignUp";

class NavBar extends Component {
  state = {
    showLogin: false,
    showSignUp: false,
    loggedIn: false,
  };

  logout = () => {
    fetch("http://localhost:9000/api/logout", { method: "POST" });
    this.setState({ loggedIn: false });
  };

  getLoginButtons = () => {
    return !this.state.loggedIn ? (
      <Nav className="ms-auto">
        <Button
          variant="primary"
          onClick={() => this.setState({ showLogin: true })}
          className="me-3"
        >
          Login
        </Button>
        <Button
          variant="primary"
          onClick={() => this.setState({ showSignUp: true })}
        >
          Sign Up
        </Button>
      </Nav>
    ) : (
      <Nav className="ms-auto">
        <p className="text me-3">You are logged in!</p>
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
              show={this.state.showLogin}
              close={() => this.setState({ showLogin: false })}
              login={() => this.setState({ loggedIn: true })}
            />
            <SignUp
              show={this.state.showSignUp}
              close={() => this.setState({ showSignUp: false })}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavBar;
