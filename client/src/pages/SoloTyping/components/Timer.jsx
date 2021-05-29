import React from "react";

const Timer = (props) => {
  const { elapsed_time } = props;

  /* Add zero to the front if number is less than 10 e.g. 9 -> 09 */
  const padZeroes = (num) => (num < 10 ? "0" + num.toString() : num);

  /* Color time gray when not typing */
  const colorTime = () => (props.typing ? {} : { color: "#AAAAAA" });

  const mins = padZeroes(Math.floor(elapsed_time / 60000));
  const secs = padZeroes(Math.floor(elapsed_time / 1000) % 60);

  return (
    <b className="text">
      Time Taken:{" "}
      <span style={colorTime()}>
        {mins}:{secs}
      </span>
    </b>
  );
};

export default Timer;
