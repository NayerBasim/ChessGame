import "./index.scss";
import ChessBoard from "../ChessBoard";
import Timer from "../Timer";
import { useEffect, useState } from "react";
import EndScreen from "../EndScreen";
import { useMatch, useSearchParams } from "react-router-dom";
import { pieceImageFromID } from "../ChessBoard/index";
function ChessPage() {
  // custom hook to get the current pathname in React
  const [searchParams] = useSearchParams();
  let name1 =
    searchParams.get("name1") == "" ? "Player 1" : searchParams.get("name1");
  let name2 =
    searchParams.get("name2") == "" ? "Player 2" : searchParams.get("name2");

  const match = useMatch("/game/:time");
  const value = match.params.time;
  const [openPrompt, setOpenPrompt] = useState("closed");
  const [player, setPlayer] = useState("W");
  const [turn, setTurn] = useState("W");
  const [winner, setWinner] = useState("W");
  const [whitePieces, setWhitePieces] = useState([]);
  const [blackPieces, setBlackPieces] = useState([]);
  const dictionary = {
    W: "white",
    B: "black",
  };

  useEffect(() => {}, [openPrompt]);

  let bottom;
  let top;
  if (player === "W") {
    bottom = "W";
    top = "B";
  } else {
    bottom = "B";
    top = "W";
  }

  return (
    <div className="ChessPage">
      <div className={`endScreenContainer ${openPrompt}`}>
        <EndScreen
          winner={dictionary[winner.slice(0, 1)]}
          reason={winner.slice(1)}
          name={winner.slice(0, 1) === "W" ? name1 : name2}
          nayerIsPlaying={name1 === "Nayer" || name2 === "Nayer"}
        />
      </div>
      <div className="timerContainer black">
        <div className=" timerBlack">
          <Timer
            key="first"
            player={top}
            mins={value}
            turn={turn}
            setOpenPrompt={setOpenPrompt}
            setWinner={setWinner}
          />
        </div>

        <h3 className="timerLabel ">{name2 === "" ? "Player 2" : name2}</h3>
      </div>
      <div className="takenPieces blacktakenPieces">
        {blackPieces.map((piece) => (
          <img
            className="takenPiece"
            key={piece}
            src={pieceImageFromID(piece.slice(0, 2))}
          />
        ))}
      </div>
      <div className="chessBoardContainer">
        <ChessBoard
          key="second"
          player={player}
          turn={turn}
          setTurn={setTurn}
          setOpenPrompt={setOpenPrompt}
          setWinner={setWinner}
          addToWhiteTaken={(piece) =>
            setWhitePieces((prev) => [...prev, piece].sort())
          }
          addToBlackTaken={(piece) =>
            setBlackPieces((prev) => [...prev, piece].sort())
          }
        />
      </div>
      <div className="takenPieces whitetakenPieces">
        {whitePieces.map((piece) => (
          <img
            className="takenPiece"
            key={piece}
            src={pieceImageFromID(piece.slice(0, 2))}
          />
        ))}
      </div>
      <div className="timerContainer white">
        <div className=" timerWhite">
          <Timer
            player={bottom}
            turn={turn}
            mins={value}
            setOpenPrompt={setOpenPrompt}
            setWinner={setWinner}
          />
        </div>
        <h3 className="timerLabel">{name1 === "" ? "Player 1" : name1}</h3>
      </div>
    </div>
  );
}

export default ChessPage;
