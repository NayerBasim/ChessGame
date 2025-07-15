import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import "./index.scss";

const Timer = ({ player, turn, mins, setOpenPrompt, setWinner }) => {
  const now = new Date();

  // Load saved expiry if exists
  const savedTime = localStorage.getItem(`${player}_expiry`);
  const expiryTimestamp = savedTime
    ? new Date(savedTime)
    : new Date(now.getTime() + parseInt(mins) * 60 * 1000);

  const opponent = player === "W" ? "B" : "W";

  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp,
      onExpire: () => {
        setOpenPrompt("open");
        localStorage.clear();
        setWinner(opponent + "time");
      },
    });

  // Save updated expiry timestamp when paused/resumed or every second
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining =
        new Date().getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000;
      localStorage.setItem(`${player}_expiry`, new Date(remaining));
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  // Control pause/resume based on turn
  useEffect(() => {
    if (player !== turn) {
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
          {hours === 0 ? "" : `${hours}:`}
          {minutes}
        </span>
        :<span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
    </div>
  );
};

export default Timer;
