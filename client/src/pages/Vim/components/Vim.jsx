import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/cobalt.css";

import "codemirror/keymap/vim";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";

const language_to_mode = {
  Java: "text/x-java",
  Python: "python",
  "C++": "text/x-c++src",
  None: "xml" /* trust me on this */,
};

class Vim extends Component {
  state = {
    options: {
      theme: "cobalt",
      lineNumbers: true,
      keyMap: "vim",
      mode: language_to_mode[this.props.language],
      readOnly: this.props.read_only,
    },
    mode: "Normal",
    command: "",
    command_done: false,
  };

  render() {
    return (
      <div>
        <CodeMirror
          value={this.props.text}
          options={this.state.options}
          editorDidMount={(editor) => {
            editor.on("vim-mode-change", (new_mode) => {
              const mode_name = new_mode["mode"];
              this.setState({
                mode:
                  mode_name.charAt(0).toUpperCase() + mode_name.substring(1),
              });
            });
            editor.on("vim-keypress", (key) => {
              const { command } = this.state;
              const new_command =
                this.state.command_done ||
                command === "<Esc>" ||
                command === ":"
                  ? key
                  : this.state.command + key;
              this.setState({ command: new_command, command_done: false });
            });

            editor.on("vim-command-done", () => {
              this.setState({
                command_done: true,
              });
            });
          }}
          onBeforeChange={this.props.onVimChange}
          onChange={(editor, data, value) => {}}
          className="box"
        />
        <p className="text code">
          {this.state.mode} Mode &nbsp; Command: {this.state.command}
        </p>
      </div>
    );
  }
}

export default Vim;
