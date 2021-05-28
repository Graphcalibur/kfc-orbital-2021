import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const SignUp = (props) => {
    return <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Enter username" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Button variant="primary" type="submit" className="float-end">
                    Sign Up
                </Button>
            </Form>
        </Modal.Body>
    </Modal>
}

export default SignUp;