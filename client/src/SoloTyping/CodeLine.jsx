import React from 'react';

/* Formats the code line accordingly:
- If it's not the current line, don't format
- Otherwise, underline all non-whitespace characters
  and color all correct chars green and all wrong chars red */
const CodeLine = (props) => {
    const { line } = props;
    if (!props.is_curr_line) return props.line;

    const non_whitespace = line.length - line.trim().length;

    const first_wrong = non_whitespace + props.first_wrong;
    const end_wrong = non_whitespace + props.curr_input_len;

    return (
      <span>
        {line.substring(0, non_whitespace)}
        <u>
          <span style={{ color: "#009933" }}>
            {line.substring(non_whitespace, first_wrong)}
          </span>
          <span style={{ color: "#ff0000" }}>
            {line.substring(first_wrong, end_wrong)}
          </span>
          {line.substring(end_wrong)}
        </u>
      </span>
    );
}

export default CodeLine;