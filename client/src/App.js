import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    state = {
        code: [
            "for (int i = 0; i < 10; i++) {",
            "\u00a0\u00a0\u00a0\u00a0cout << i << endl;",
            "}"
        ],
        currLine: 0
    }
    
    handleSubmit = (event) => {
        if (event.key === "Enter") {
            const textInput = document.getElementById("textInput");
            const {code, currLine} = this.state;
            
            if (textInput.value === code[currLine].trim()) {
                document.getElementById("textInput").value = "";
                
                if (currLine < code.length - 1) {
                    this.setState({currLine: currLine + 1});
                }
            }
        }
    }
    
    render() {
        return (
            <div className="mb-3">
                {this.state.code.map(line =>
                    <label
                        htmlFor="textInput"
                        className="form-label code"
                    >
                        {line}
                    </label>)}
                
                <input
                    id="textInput"
                    type="text"
                    className="form-control code"
                    autoComplete="off"
                    placeholder="Start typing here..."
                    onKeyPress={this.handleSubmit}
                />
            </div>
        );
    }
}

export default App;
