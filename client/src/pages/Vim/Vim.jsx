import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/cobalt.css";

/* Bug: After switching to insert mode, you can no longer
move left or right. This is a bug with CodeMirror so there's
nothing we can do to fix it. */

/* Needed to have Java syntax highlighting */
// require("codemirror/mode/clike/clike");
require("codemirror/keymap/vim");

const Vim = (props) => {
  const [mode, setMode] = useState("Normal");

  return (
    <Container className="box mb-4">
      <CodeMirror
        value={props.text}
        options={{
          theme: "cobalt",
          lineNumbers: true,
          keyMap: "vim",
        }}
        editorDidMount={(editor) => {
          editor.on("vim-mode-change", (new_mode) => {
            const mode_name = new_mode["mode"];
            setMode(mode_name.charAt(0).toUpperCase() + mode_name.substring(1));
          });
        }}
        onBeforeChange={props.onVimChange}
        onChange={(editor, data, value) => {}}
      />
      <p className="text">{mode} Mode</p>
    </Container>
  );
};

export default Vim;
