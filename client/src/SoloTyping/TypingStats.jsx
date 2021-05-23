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
      <p className="text mt-3">
        Accuracy: {accuracy}% <br />
        Speed: {wpm} WPM
      </p>
    );
}

export default TypingStats;