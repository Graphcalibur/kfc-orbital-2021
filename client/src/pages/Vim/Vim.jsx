import React from "react";
import { Container } from "react-bootstrap";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/cobalt.css";

/* Needed to have Java syntax highlighting */
require("codemirror/mode/clike/clike");
require("codemirror/keymap/vim");

const Vim = (props) => {
  return (
    <Container className="box mb-4">
      <CodeMirror
        value={props.text}
        options={{
          theme: "cobalt",
          lineNumbers: true,
          keyMap: "vim",
        }}
        onBeforeChange={props.onVimChange}
        onChange={(editor, data, value) => {}}
      />
    </Container>
  );
};

export default Vim;
