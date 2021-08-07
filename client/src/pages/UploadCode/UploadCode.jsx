import React, { Component } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Controlled as CodeMirror } from "react-codemirror2";

class UploadCode extends Component {
  state = {
    language: "",
    code: "",
    upload_state: 0,
  };

  uploadCode = (event) => {
    event.preventDefault();
    event.stopPropagation();

    fetch("/api/code/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        language: this.state.language,
        code: this.state.code,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          this.setState({ upload_state: 1 });
        } else {
          this.setState({ upload_state: res.status });
        }
      })
      .catch((error) => this.setState({ upload_state: "Unknown" }));
  };

  render() {
    return (
      <Container>
        <h1 className="text">
          <b>Upload Code</b>
        </h1>
        <Form onSubmit={this.uploadCode}>
          <Form.Group>
            <Form.Label className="text">Language</Form.Label>
            <Form.Control
              required
              id="language"
              value={this.state.language}
              onChange={(event) => {
                this.setState({ language: event.target.value });
              }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text mt-3">Code</Form.Label>
            <CodeMirror
              id="code"
              value={this.state.code}
              options={{
                theme: "cobalt",
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => {
                this.setState({ code: value });
              }}
              onChange={(editor, data, value) => {}}
            />
          </Form.Group>

          <Button variant="outline-info" className="mt-3" type="submit">
            Upload Code
          </Button>
        </Form>

        {this.state.upload_state === 0 ? (
          <span></span>
        ) : this.state.upload_state === 1 ? (
          <p className="text mt-3"> Upload Successful!</p>
        ) : (
          <p className="text mt-3">
            {" "}
            Upload failed! Error: {this.state.upload_state}
          </p>
        )}
      </Container>
    );
  }
}

export default UploadCode;
