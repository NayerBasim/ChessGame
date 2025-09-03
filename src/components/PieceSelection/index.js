import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { pieceImageFromID } from "../ChessBoard/helpers/displayFunctions";
function EndScreen({ setSelectPrompt, selectPrompt, blockID, positions }) {
  const handleChoice = (piece) => {
    positions[blockID[0] + blockID[1]] = piece;
    setSelectPrompt(null);
  };
  return (
    <div
      className="pieceSelection"
      style={{ display: selectPrompt ? "flex" : "none" }}
    >
      <h2>Choose a Piece</h2>
      <div className="pieceOptions">
        <div onClick={() => handleChoice(selectPrompt + "Q")}>
          <img src={pieceImageFromID(selectPrompt + "Q")} />
        </div>
        <div onClick={() => handleChoice(selectPrompt + "N")}>
          <img src={pieceImageFromID(selectPrompt + "N")} />
        </div>
        <div onClick={() => handleChoice(selectPrompt + "B")}>
          <img src={pieceImageFromID(selectPrompt + "B")} />
        </div>
        <div onClick={() => handleChoice(selectPrompt + "R")}>
          <img src={pieceImageFromID(selectPrompt + "R")} />
        </div>
      </div>
    </div>
  );
}

export default EndScreen;
