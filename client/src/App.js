import React, { Component } from 'react';
import './App.css';

class App extends Component {
    state = {
        code: [
            "for (int i = 0; i < 10; i++) {",
            "\u00a0\u00a0\u00a0\u00a0cout << i << endl;",
            "}"
        ],
        currLineNum: 1,
        currInput: ""
    }
    
    /* When pressing enter, check if the text in the input
    matches the current line being typed. If it does, clear
    the input and move on to the next line */
    handleSubmit = (event) => {
        if (event.key === "Enter") {
            const textInput = document.getElementById("textInput");
            const {code, currLineNum} = this.state;
            
            if (textInput.value === code[currLineNum].trim()) {
                document.getElementById("textInput").value = "";
                this.setState({currInput: ""});
                
                if (currLineNum < code.length - 1) {
                    this.setState({currLineNum: currLineNum + 1});
                }
            }
        }
    }

    /* Adds underline to the line if it's the current line */
    underlineLine = (line, i) => {
        return i === this.state.currLineNum
            ? <u>{this.colorLine(line)}</u>
            : line
    }
    
    colorLine = (line) => {
        const { currInput } = this.state;

        // Start at first non-whitespace character
        let line_i = line.length - line.trim().length;
        let input_i = 0;

        let endCorrect = line_i;
        let endWrong = line_i;

        while (line_i < line.length && input_i < currInput.length) {
            if (line.charAt(line_i) === currInput.charAt(input_i)) {
                endCorrect++;
            }
            
            endWrong++;
            line_i++;
            input_i++;
        }

        return <span>
            <span style={{color:"#009933"}}>
                {line.substring(0, endCorrect)}
            </span>
            <span style={{color:"#ff0000"}}>
                {line.substring(endCorrect, endWrong)}
            </span>
            {line.substring(endWrong)}
        </span>
    }

    handleInputChange = (event) => {
        this.setState({
            currInput: event.target.value
        });
    }

    render() {
        return (
            <div className="mb-3">
                {this.state.code.map((line, i) =>
                    <label
                        htmlFor="textInput"
                        className="form-label code"
                        key={line}
                    >
                        {this.underlineLine(line, i)}
                    </label>)}
                    
                <input
                    id="textInput"
                    type="text"
                    className="form-control code"
                    autoComplete="off"
                    placeholder="Start typing here..."
                    onKeyPress={this.handleSubmit}
                    onChange={(event) => this.handleInputChange(event)}
                />
            </div>
        );
    }
}

export default App;
