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
    can_upload_code: false,
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

    fetch("/api/permission-list", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res !== null && res[0] === "upload-code")
          this.setState({ can_upload_code: true });
      });
  }

  /* Logs out and refreshes the page */
  logout = () => {
    this.props.socket.emit("logout-ws");

    fetch("/api/logout", {
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
          variant="outline-info"
          onClick={() => this.setState({ show_login: true })}
          className="me-3"
        >
          Login
        </Button>
        <Button
          variant="outline-info"
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
        <Button variant="outline-info" onClick={() => this.logout()}>
          Logout
        </Button>
      </Nav>
    );
  };

  render() {
    return (
      <Navbar variant="dark" expand="sm" className="mb-3">
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
              <a
                className="nav-link"
                href="https://forms.gle/4AyL1Topw5GPmfnEA"
              >
                Contribute
              </a>
              {this.state.can_upload_code ? (
                <Link className="nav-link" to="/uploadcode">
                  Upload Code
                </Link>
              ) : (
                <span></span>
              )}
            </Nav>

            {this.getLoginButtons()}

            <Login
              show={this.state.show_login}
              close={() => this.setState({ show_login: false })}
              socket={this.props.socket}
            />
            <SignUp
              show={this.state.show_sign_up}
              close={() => this.setState({ show_sign_up: false })}
              socket={this.props.socket}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default NavBar;
