import React from 'react';
import CodeLine from "./CodeLine";

const Code = (props) => {
    return <div className="mt-3">
        {props.code.map((line, i) => (
        <label htmlFor="textInput" className="form-label code text" key={line}>
            <CodeLine
                is_curr_line={props.curr_line_num === i}
                line={line}
                first_wrong={props.first_wrong}
                curr_input_len={props.curr_input_len}
            />
        </label>
        ))}
  </div>
}

export default Code;