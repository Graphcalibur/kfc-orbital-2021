import React, { Component } from 'react';
import './App.css';

class App extends Component {
    state = {
        code: [
            "for (int i = 0; i < 10; i++) {",
            "\u00a0\u00a0\u00a0\u00a0cout << i << endl;",
            "}"
        ],
        curr_line_num: 0,
        curr_input: "",
        first_wrong: 0
    }
    
    /* When pressing enter, check if the text in the input
    matches the current line being typed. If it does, clear
    the input and move on to the next line */
    handleSubmit = (event) => {
        if (event.key === "Enter") {
            const text_input = document.getElementById("textInput");
            const {code, curr_line_num} = this.state;
            
            if (text_input.value === code[curr_line_num].trim()) {
                document.getElementById("textInput").value = "";
                this.setState({curr_input: "",
                               first_wrong: 0,
                               curr_line_num: Math.min(code.length - 1, curr_line_num + 1)});
            }
        }
    }

    /* Adds underline to the line if it's the current line */
    formatLine = (line, i) => {
        return i === this.state.curr_line_num
            ? this.colorLine(line)
            : line
    }
    
    /* Color letters in the current line based on whether they
    were typed correctly or wrongly */
    colorLine = (line) => {
        // Start at first non-whitespace character
        const non_whitespace = line.length - line.trim().length;

        const first_wrong = non_whitespace + this.state.first_wrong;
        const end_wrong = non_whitespace + this.state.curr_input.length;

        return <span>
            {line.substring(0, non_whitespace)}
            <u>
                <span style={{color:"#009933"}}>
                    {line.substring(non_whitespace, first_wrong)}
                </span>
                <span style={{color:"#ff0000"}}>
                    {line.substring(first_wrong, end_wrong)}
                </span>
                {line.substring(end_wrong)}
            </u>
        </span>
    }

    /* Get first wrong character in input */
    getFirstWrong = (line, curr_input) => {
        const trimmed_line = line.trim();
        let i = 0;

        for (; i < trimmed_line.length && i < curr_input.length; i++) {
            if (trimmed_line.charAt(i) !== curr_input.charAt(i)) {
                break;
            }
        }

        return i;
    }

    handleInputChange = (event) => {
        const {code, curr_line_num} = this.state;
        const first_wrong = this.getFirstWrong(code[curr_line_num],
                                               event.target.value);

        this.setState({
            first_wrong: first_wrong,
            curr_input: event.target.value
        });
    }

    getInputStyle = () => {
        return this.state.first_wrong < this.state.curr_input.length
            ? {backgroundColor: "#ff6666"}
            : {}
    }

    render() {
        return (
            <div className="container-xl">
                <div>
                    {this.state.code.map((line, i) =>
                        <label
                            htmlFor="textInput"
                            className="form-label code"
                            key={line}
                        >
                            {this.formatLine(line, i)}
                        </label>)}
                </div>

                <input
                    id="textInput"
                    type="text"
                    className="form-control code"
                    autoComplete="off"
                    placeholder="Start typing here..."
                    style={this.getInputStyle()}
                    onKeyPress={this.handleSubmit}
                    onChange={(event) => this.handleInputChange(event)}
                />
            </div>
        );
    }
}

export default App;
