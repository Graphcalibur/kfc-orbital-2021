/* Get length of the given code in characters */
export const getCodeLength = (code) => {
  let code_length = 0;

  for (let i = 0; i < code.length; i++) {
    code_length += code[i].trim().length; /* Don't count starting whitespace */
  }

  return code_length;
};

/* Get the first wrongly typed character in the input */
export const getFirstWrong = (line, curr_input) => {
  const trimmed_line = line.trim();
  let i = 0;

  for (; i < trimmed_line.length && i < curr_input.length; i++) {
    if (trimmed_line.charAt(i) !== curr_input.charAt(i)) {
      break;
    }
  }

  return i;
};

/* When pressing enter, check if the text in the input
      matches the current line being typed. If it does, clear
      the input and move on to the next line */
export const handleSubmitGeneric = (event, state) => {
  if (event.key === "Enter" && state.typing) {
    const { curr_input, code, curr_line_num } = state;

    if (curr_input === code[curr_line_num].trim()) {
      return {
        curr_input: "",
        first_wrong: 0,
        curr_line_num: curr_line_num + 1,
        typing: curr_line_num < code.length - 1,
      };
    }
  }

  return null;
};

/* Check for wrong inputs whenever the input changes */
export const handleInputChangeGeneric = (new_input, state, startTyping) => {
  if (!state.started) {
    startTyping();
  }
  const { code, curr_line_num, curr_input } = state;

  const new_first_wrong = getFirstWrong(code[curr_line_num], new_input);
  let new_typed_wrong = state.typed_wrong;

  /* Only count wrong characters if user added characters to the input */
  if (
    curr_input.length < new_input.length &&
    new_first_wrong < new_input.length
  ) {
    new_typed_wrong++;
  }

  return {
    typed_wrong: new_typed_wrong,
    first_wrong: new_first_wrong,
    curr_input: new_input,
  };
};

/* Calculates progress of a player in % */
export const getPlayerProgress = (code, player_state) => {
  const line_no = player_state["line_no"];
  if (line_no >= code.length) return 100;

  let curr_len = getFirstWrong(code[line_no], player_state["current_line"]);
  for (let i = 0; i < line_no; i++) {
    curr_len += code[i].trim().length;
  }

  return Math.round((curr_len * 100) / getCodeLength(code));
};
