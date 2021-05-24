import React from 'react';

/* Formats the code line accordingly:
- Replaces all whitespace at the beginning with \u00a0 so
  that the whitepsace is rendered
- If it's not the current line, don't format
- Otherwise, underline all non-whitespace characters
  and color all correct chars green and all wrong chars red */
const CodeLine = (props) => {
    const { line } = props;
    const non_whitespace = line.length - line.trim().length;

    if (!props.is_curr_line) {
      return "\u00a0".repeat(non_whitespace) + line.substring(non_whitespace);
    }

    console.log(non_whitespace);

    const first_wrong = non_whitespace + props.first_wrong;
    const end_wrong = non_whitespace + props.curr_input_len;

    return (
      <span>
        {"\u00a0".repeat(non_whitespace)}
        <u>
          <span style={{ color: "#00cc44" }}>
            {line.substring(non_whitespace, first_wrong)}
          </span>
          <span style={{ color: "#ff1a1a" }}>
            {line.substring(first_wrong, end_wrong)}
          </span>
          {line.substring(end_wrong)}
        </u>
      </span>
    );
}

export default CodeLine;