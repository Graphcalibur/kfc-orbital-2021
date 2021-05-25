import React from 'react';

const TypingStats = (props) => {
    /* Show no stats if typing test hasn't ended */
    if (!props.ended) return <></>;

    const { code, typed_wrong } = props;
    let code_length = 0;

    for (let i = 0; i < code.length; i++) {
      code_length += code[i].trim().length;
    }

    const accuracy =
      Math.round((code_length / (typed_wrong + code_length)) * 1000) / 10;
    const wpm = Math.round(code_length / 5 / (props.elapsed_time / 60000));

    return (
      <div className="mt-3">
        <hr className="text"/>
        <h3 className="text">Your Typing Stats:</h3>

        <p className="text">
          Accuracy: {accuracy}% <br />
          Speed: {wpm} WPM
        </p>

        <button
          onClick={props.reset}
          type="button"
          className="btn btn-primary me-4"
        >
          Try Again
        </button>

        <button
          onClick={() => {props.getCode(); props.reset();}}
          type="button"
          className="btn btn-primary me-4"
        >
          New Practice
        </button>
      </div>
    );
}

export default TypingStats;