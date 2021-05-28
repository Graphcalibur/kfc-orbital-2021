import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const Login = (props) => {
    return <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Username" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                    <span style={{fontSize:"80%"}}>Forgot password?</span>
                </Form.Group>

                <Button variant="primary" type="submit" className="float-end">
                    Login
                </Button>
            </Form>
        </Modal.Body>
    </Modal>
}

export default Login;