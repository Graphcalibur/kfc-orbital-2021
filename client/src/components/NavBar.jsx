import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Navbar, Nav} from "react-bootstrap";

import Login from "./Login";
import SignUp from "./SignUp";

const NavBar = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    return <Navbar variant="dark" bg="dark" expand="sm" className="mb-3">
        <Container fluid>
            <Link className="navbar-brand" to="/">CodeRacer</Link>
            <Navbar.Toggle aria-controls="navbar-nav"/>
            <Navbar.Collapse id="navbar-nav">
                <Nav>
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/lang">Race</Link>
                    <Link className="nav-link" to="/lang">Practice</Link>
                </Nav>

                <Nav className="ms-auto">
                    <Button variant="primary" onClick={() => setShowLogin(true)} className="me-3" >
                        Login
                    </Button>
                    <Button variant="primary" onClick={() => setShowSignUp(true)}>
                        Sign Up
                    </Button>
                </Nav>

                <Login show={showLogin} close={() => setShowLogin(false)}/>
                <SignUp show={showSignUp} close={() => setShowSignUp(false)} />
            </Navbar.Collapse>
        </Container>
    </Navbar>
}

export default NavBar;