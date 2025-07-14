import React, { useState, useRef, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import "./index.scss";

const Timer = ({ player, turn, mins, setOpenPrompt, setWinner }) => {
  const time = new Date();
  let expiryTimestamp = time.setSeconds(
    time.getSeconds() + parseInt(mins) * 60
  );
  let opponent;
  if (player === "W") {
    opponent = "B";
  } else {
    opponent = "W";
  }

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      setOpenPrompt("open");
      setWinner(opponent + "time");
    },
  });
  useEffect(() => {
    if (player != turn) {
      pause();
    } else {
      resume();
    }
  }, [turn]);

  return (
    <div
      className="timer"
      style={{ border: player === turn ? "10px solid orange" : "none" }}
    >
      <div className={`colourBox ${player}`}></div>
      <div>
        <span>
          {hours == 0 ? "" : `${hours}:`}
          {minutes}
        </span>
        :<span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
    </div>
  );
};

export default Timer;
