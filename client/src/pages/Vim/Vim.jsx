import React from "react";
import { Container } from "react-bootstrap";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/cobalt.css";

import "codemirror/keymap/vim";
import "codemirror/mode/clike/clike";

const Vim = (props) => {
  const options = {
    theme: "cobalt",
    lineNumbers: true,
    keyMap: "vim",
    readOnly: props.read_only ? "nocursor" : false,
  };

  if (props.is_practice) {
    options.mode = "text/x-java";
  } else {
    options.mode = "xml";
  }

  return (
    <Container className="box mb-4">
      <CodeMirror
        value={props.text}
        options={options}
        onBeforeChange={props.onVimChange}
        onChange={(editor, data, value) => {}}
      />
    </Container>
  );
};

export default Vim;
