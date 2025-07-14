import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";
function StartScreen() {
  const [gameTime, setGameTime] = useState("5");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");

  const handlechange = (e) => {
    setGameTime(e.target.value);
  };
  return (
    <div className="startScreen">
      <label for="game-time">Select Time</label>
      <select onChange={handlechange} name="game-time" id="game-time">
        <option value="5">5 minutes</option>
        <option value="10">10 minutes</option>
        <option value="15">15 minutes</option>
        <option value="20">20 minutes</option>
      </select>
      <input
        type="text"
        onChange={(e) => {
          setName1(e.target.value);
          console.log(name1);
        }}
        placeholder="Enter Player 1 Name"
      />
      <input
        type="text"
        onChange={(e) => setName2(e.target.value)}
        placeholder="Enter Player 2 Name"
      />

      <Link to={`/game/${gameTime}?name1=${name1}&name2=${name2}`}>
        <button>START</button>
      </Link>
    </div>
  );
}

export default StartScreen;
