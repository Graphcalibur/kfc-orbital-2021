import React from "react";

const TypingInput = (props) => {
  const style = props.is_wrong
    ? { backgroundColor: "#800000", color: "white" }
    : { backgroundColor: "#233243", color: "white" };

  return (
    <input
      type="text"
      className="form-control code mb-4"
      autoComplete="off"
      placeholder="Start typing here..."
      style={style}
      value={props.curr_input}
      readOnly={props.ended}
      onKeyPress={props.handleSubmit}
      onChange={(event) => props.handleInputChange(event)}
      ref={props.setRef}
    />
  );
};

export default TypingInput;
