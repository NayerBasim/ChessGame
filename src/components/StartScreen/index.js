import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";
function StartScreen() {
  const [gameTime, setGameTime] = useState("5");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [flip, setFlip] = useState(true);

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
        minLength="1"
        maxLength="12"
        required
        onChange={(e) => {
          setName1(e.target.value);
        }}
        placeholder="Enter Player 1 Name"
      />
      <input
        minLength="1"
        maxLength="12"
        required
        type="text"
        onChange={(e) => setName2(e.target.value)}
        placeholder="Enter Player 2 Name"
      />
      <div className="checkbox">
        <input
          type="checkbox"
          value={flip}
          onChange={(e) => {
            setFlip((prev) => !prev);
          }}
        />
        <p style={{ fontWeight: "600" }}>
          Do not flip the board for every turn
        </p>
      </div>

      <Link to={`/game/${gameTime}?name1=${name1}&name2=${name2}&flip=${flip}`}>
        <button onClick={() => localStorage.clear()}>START</button>
      </Link>
    </div>
  );
}

export default StartScreen;
