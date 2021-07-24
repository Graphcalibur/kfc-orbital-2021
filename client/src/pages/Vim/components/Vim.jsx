import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/cobalt.css";

import "codemirror/keymap/vim";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";

const Vim = (props) => {
  const language_to_mode = {
    Java: "text/x-java",
    Python: "python",
    "C++": "text/x-c++src",
    None: "xml" /* trust me on this */,
  };

  const options = {
    theme: "cobalt",
    lineNumbers: true,
    keyMap: "vim",
    mode: language_to_mode[props.language],
    readOnly: props.read_only,
  };

  return (
    <CodeMirror
      value={props.text}
      options={options}
      onBeforeChange={props.onVimChange}
      onChange={(editor, data, value) => {}}
      className="box mb-4"
    />
  );
};

export default Vim;
