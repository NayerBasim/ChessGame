import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

function EndScreen({ winner, reason, name, nayerIsPlaying }) {
  return (
    <div className="endScreen">
      <h2>Winner is {nayerIsPlaying ? "Nayer" : name}</h2>
      <h3>By {reason}</h3>
      <Link to="/">
        <button>HOME</button>
      </Link>
    </div>
  );
}

export default EndScreen;
