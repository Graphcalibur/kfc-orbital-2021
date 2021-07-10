import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { UnControlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/cobalt.css";

/* Needed to have Java syntax highlighting */
require("codemirror/mode/clike/clike");
require("codemirror/keymap/vim");

class Vim extends Component {
  render() {
    return (
      <Container fluid="lg">
        <h1 className="text">
          <b>Vim Practice</b>
        </h1>

        <Container className="box">
          <CodeMirror
            value="Start typing here!"
            options={{
              mode: "text/x-java",
              theme: "cobalt",
              lineNumbers: true,
              keyMap: "vim",
            }}
            onChange={(editor, data, value) => {}}
          />
        </Container>
      </Container>
    );
  }
}

export default Vim;
