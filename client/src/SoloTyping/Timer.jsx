import React from 'react';

const Timer = (props) => {
    const { elapsed_time } = props;
    const padZeroes = (num) => num < 10 ? "0" + num.toString() : num;

    const mins = padZeroes(Math.floor(elapsed_time / 60000));
    const secs = padZeroes(Math.floor(elapsed_time / 1000) % 60);

    return <b>
        Time Taken: {mins}:{secs}
    </b>
}

export default Timer;