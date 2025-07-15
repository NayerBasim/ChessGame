import "./index.scss";
import { useState, useRef, useEffect } from "react";
import Timer from "../Timer";
import sound from "../../media/knock.mp3";
import checkSound from "../../media/snap-sound-effect.mp3";
import illegalSound from "../../media/metal-vibration.mp3";
import PieceSelection from "../PieceSelection";
import {
  opponent,
  whitePawnMoves,
  blackPawnMoves,
  knightMoves,
  bishopMoves,
  rookMoves,
  kingMoves,
  queenMoves,
} from "./functions";

export function pieceImageFromID(id) {
  const map = {
    WK: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/45px-Chess_klt45.svg.png",
    WQ: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/45px-Chess_qlt45.svg.png",
    WR: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/45px-Chess_rlt45.svg.png",
    WB: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/45px-Chess_blt45.svg.png",
    WN: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/45px-Chess_nlt45.svg.png",
    WP: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/45px-Chess_plt45.svg.png",

    BK: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/45px-Chess_kdt45.svg.png",
    BQ: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/45px-Chess_qdt45.svg.png",
    BR: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/45px-Chess_rdt45.svg.png",
    BB: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/45px-Chess_bdt45.svg.png",
    BN: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/45px-Chess_ndt45.svg.png",
    BP: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/45px-Chess_pdt45.svg.png",
  };

  // Take just the piece type (e.g. "WP" from "WP1", "WR2")
  const prefix = id.slice(0, 2);

  return map[prefix] || ""; // fallback to empty string if not found
}

// taking pierces ruins check mechanics.
function ChessBoard({
  player,
  turn,
  setTurn,
  setOpenPrompt,
  setWinner,
  allowFlip,
  addToWhiteTaken,
  addToBlackTaken,
}) {
  let canCastleW = [true, true];
  let canCastleB = [true, true];
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [kingPositions, setKingPositions] = useState(["e1", "e8"]);
  const [ischeckMate, setIsCheckMate] = useState(false);
  const [selectPrompt, setSelectPrompt] = useState(null);
  const [blockID, setBlockID] = useState(["", ""]); // stores the block ID of the piece being moved
  const [redHighlightW, setRedHighlightW] = useState(false);
  const [redHighlightB, setRedHighlightB] = useState(false);

  let [positions, setPositions] = useState({
    a1: "WR1",
    b1: "WN1",
    c1: "WB1",
    d1: "WQ",
    e1: "WK",
    f1: "WB2",
    g1: "WN2",
    h1: "WR2",
    a2: "WP1",
    b2: "WP2",
    c2: "WP3",
    d2: "WP4",
    e2: "WP5",
    f2: "WP6",
    g2: "WP7",
    h2: "WP8",
    a8: "BR1",
    b8: "BN1",
    c8: "BB1",
    d8: "BQ",
    e8: "BK",
    f8: "BB2",
    g8: "BN2",
    h8: "BR2",
    a7: "BP1",
    b7: "BP2",
    c7: "BP3",
    d7: "BP4",
    e7: "BP5",
    f7: "BP6",
    g7: "BP7",
    h7: "BP8",
  });
  let [chosen, setChosen] = useState(false);
  //possible, positionx, positiony, id
  let [data, setData] = useState({
    possible: [],
    positionx: "",
    positiony: "",
    id: "",
  });

  const boardRef = useRef(null);

  useEffect(() => {
    const savedState = localStorage.getItem("chessGameState");
    const kingLocationsState = localStorage.getItem("kingLocations");
    const currentTurn = localStorage.getItem("turn");
    if (savedState) {
      const boardState = JSON.parse(savedState);
      const turn = JSON.parse(currentTurn);
      const kingLocations = JSON.parse(kingLocationsState);
      setPositions(boardState);
      console.log(turn.turn);
      setKingPositions(kingLocations.locations);
      setTurn(turn.turn);
    }
  }, []);

  useEffect(() => {
    setData({
      possible: [],
      positionx: "",
      positiony: "",
      id: "",
    });
  }, [turn]);

  const checkIllegal = (king, moves, positionx, positiony) => {
    let adjustedMoves = [];
    let oldPosition = positionx + positiony;
    moves.forEach((possibility) => {
      if (
        !check(king, [
          positions[positionx + positiony],
          oldPosition,
          possibility,
        ])
      ) {
        adjustedMoves.push(possibility);
      }
    });
    return adjustedMoves;
  };

  const getPossibleMoves = (
    type,
    positionx,
    positiony,
    possible,
    positions
  ) => {
    switch (type) {
      case "WP":
        possible = whitePawnMoves(positionx, positiony, possible, positions);
        break;

      case "BP":
        possible = blackPawnMoves(positionx, positiony, possible, positions);
        break;

      case "WR":
      case "BR":
        possible = rookMoves(positionx, positiony, possible, positions);
        break;

      case "WK":
      case "BK":
        possible = kingMoves(positionx, positiony, possible, positions);
        break;

      case "WB":
      case "BB":
        possible = bishopMoves(positionx, positiony, possible, positions);
        break;

      case "WQ":
      case "BQ":
        possible = queenMoves(positionx, positiony, possible, positions);
        break;

      case "WN":
      case "BN":
        possible = knightMoves(positionx, positiony, possible, positions);
        break;

      default:
        console.log("Error");
        break;
    }

    setData((prev) => ({
      ...prev,
      possible: possible,
    }));
  };

  function handleDrag(e) {
    const ghost = document.getElementById("ghostPiece");
    if (ghost && e.clientX && e.clientY) {
      ghost.style.left = `${e.clientX - 22}px`;
      ghost.style.top = `${e.clientY - 22}px`;
    }
  }

  const handleDrop = (e) => {
    setDraggedPiece(null);
    e.target.style.opacity = "1"; // Reset opacity after drop
  };

  const checkAudio = new Audio(checkSound);
  const illegalMoveAudio = new Audio(illegalSound);
  const audio = new Audio(sound);
  checkAudio.playbackRate = 2.5;
  audio.playbackRate = 2.5;
  illegalMoveAudio.playbackRate = 2.5;

  // detects checks
  const check = (king, exceptions = []) => {
    let possible = [];
    let allpossible = [];

    let positionsCopy = JSON.parse(JSON.stringify(positions));
    let kingPositionsUsed = JSON.parse(JSON.stringify(kingPositions));
    if (exceptions.length != 0) {
      delete positionsCopy[exceptions[1]]; // old position
      positionsCopy[exceptions[2]] = exceptions[0]; //new position <- id

      if (exceptions[0] === "WK") {
        kingPositionsUsed[0] = exceptions[2];
      } else if (exceptions[0] === "BK") {
        kingPositionsUsed[1] = exceptions[2];
      }
    }
    let elements = [];

    for (let id of Object.values(positionsCopy)) {
      elements.push(document.getElementById(id));
    }

    for (let element of elements) {
      if (element.id[0] == opponent(king)) {
        possible = handleLogic(
          element.classList,
          element.id,
          positionsCopy,
          false
        );
        allpossible = allpossible.concat(possible);
      }
    }

    if (opponent(king) === "B") {
      if (allpossible.includes(kingPositionsUsed[0])) {
        return true;
      }
    } else {
      if (allpossible.includes(kingPositionsUsed[1])) {
        return true;
      }
    }

    return false;
  };

  const checkMate = (king) => {
    //loop through each piece object
    //   get possible moves for the piece
    //   run check()
    //   check if check() if false to return false
    //otherwise return true'

    let flag = true;
    console.log("Mate");

    let elements = [];
    console.log(positions);
    for (let id of Object.values(positions)) {
      elements.push(document.getElementById(id));
    }

    for (let element of elements) {
      if (element.id[0] == king) {
        let possible = handleLogic(
          element.classList,
          element.id,
          positions,
          false
        );

        possible.forEach((possibility) => {
          let oldPosition =
            element.classList[3] + parseInt(element.classList[2][1]);
          console.log(check(king, [element.id, oldPosition, possibility]));
          if (!check(king, [element.id, oldPosition, possibility])) {
            flag = false;
            console.log(element.id + " " + oldPosition + " " + possibility);
          }
        });
      }
    }
    console.log("checkmate is " + flag);
    return flag;
  };

  // Hadles the logic of the game by assigning possiple positions
  // thepieces can move and is initiated by clicking on a piece
  const pieceEventListener = (e) => {
    handleLogic(e.target.classList, e.target.id, positions, true);
  };

  const pieceEventListenerDrag = (e) => {
    const id = e.target.id;
    setDraggedPiece(id);

    // Create a transparent drag image to hide the default ghost image
    // const img = new Image();
    // img.src =
    //   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==";
    // e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.setData("text/plain", e.target.id); // Required!
    e.target.style.opacity = "0.2"; // Make the piece semi-transparent while dragging
    handleLogicDrag(e.target.classList, e.target.id, positions, true);
  };

  const pieceEventListenerDrop = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id); // Required!
    handleLogicDrop(e.target.classList, e.target.id, positions, true);
  };

  // handles the logic of the game by assigning possible positions
  // the pieces can move and is initiated by clicking on a square

  const handleLogic = (classList, id, positions, game = true) => {
    let possible = []; //stores possible move positions

    let position = Object.keys(positions).find((key) => positions[key] === id);
    if (!position) return possible; // In case piece not found

    let type = id.slice(0, 2); // e.g., "WP", "BK", etc.
    let positionx = position[0]; // e.g., "e"
    let positiony = parseInt(position[1]); // e.g., 4

    // Check if being eaten
    if (game) {
      if (
        chosen == true &&
        data["possible"].includes(positionx + positiony) &&
        turn == data["id"][0]
      ) {
        if (
          positions[positionx + positiony][0] != data["id"][0] &&
          ischeckMate == false
        ) {
          let el = document.getElementById(id);
          // // el.classList.add("out");
          // delete positions[positionx + positiony];
          handleBlock(
            positionx + positiony,
            data["possible"],
            data["positionx"],
            data["positiony"],
            data["id"]
          );
          return;
        }
      }
    }

    // LOGIC FOR EACH PIECE
    getPossibleMoves(type, positionx, positiony, possible, positions);
    // setData((prev) => ({
    //   ...prev,
    //   possible: checkIllegal(type[0], possible, positionx, positiony),
    // }));
    // logs the data to be used when a block is clicked

    if (game) {
      setChosen(true);
      data["possible"] = possible;
      data["positionx"] = positionx;
      data["positiony"] = positiony;
      data["id"] = id;

      return 1;
    } else {
      return possible;
    }
  };

  const handleLogicDrag = (classList, id, positions, game = true) => {
    let possible = []; //stores possible move positions

    // gets the pice along with its position on the board
    let type = classList[1];
    let positiony = parseInt(classList[2][1]);
    let positionx = classList[3];

    getPossibleMoves(type, positionx, positiony, possible, positions);
    // LOGIC FOR EACH PIECE

    // logs the data to be used when a block is clicked

    if (game) {
      setChosen(true);
      data["possible"] = possible;
      data["positionx"] = positionx;
      data["positiony"] = positiony;
      data["id"] = id;

      return 1;
    } else {
      return possible;
    }
  };

  const handleLogicDrop = (classList, id, positions, game = true) => {
    let positiony = parseInt(classList[2][1]);
    let positionx = classList[3];
    if (game) {
      if (
        chosen == true &&
        data["possible"].includes(positionx + positiony) &&
        turn == data["id"][0]
      ) {
        if (
          positions[positionx + positiony][0] != data["id"][0] &&
          ischeckMate == false
        ) {
          let el = document.getElementById(id);
          // el.classList.add("out");
          // delete positions[positionx + positiony];
          handleBlock(
            positionx + positiony,
            data["possible"],
            data["positionx"],
            data["positiony"],
            data["id"]
          );
        }
      }
    }
  };

  const castleLeftW = () => {
    if (
      canCastleW[0] &&
      !positions["b1"] &&
      !positions["c1"] &&
      !positions["d1"]
    ) {
      delete positions["e1"];
      delete positions["a1"];
      positions["c1"] = "WK";
      positions["d1"] = "WR1";
    }
  };
  const castleRightW = () => {
    if (canCastleW[1] && !positions["f1"] && !positions["g1"]) {
      delete positions["e1"];
      delete positions["h1"];
      positions["g1"] = "WK";
      positions["f1"] = "WR1";
    }
  };
  const castleLeftB = () => {
    if (
      canCastleB[0] &&
      !positions["b8"] &&
      !positions["c8"] &&
      !positions["d8"]
    ) {
      delete positions["e8"];
      delete positions["a8"];
      positions["c8"] = "BK";
      positions["d8"] = "BR1";
    }
  };
  const castleRightB = () => {
    if (canCastleB[1] && !positions["f8"] && !positions["g8"]) {
      delete positions["e8"];
      delete positions["h8"];
      positions["g8"] = "BK";
      positions["f8"] = "BR1";
    }
  };

  const squareEventListener = (e) =>
    handleBlock(
      e.target.id,
      data["possible"],
      data["positionx"],
      data["positiony"],
      data["id"]
    );
  const handleBlock = (id, possible, positionx, positiony, pieceID) => {
    let piece = document.getElementById(pieceID);
    let illegalMove;
    console.log(positions);

    if (chosen == true) {
      let colour = pieceID[0];
      let blockID = id;
      let caslted = false;

      // moving pieces
      console.log(pieceID, positionx + positiony, blockID[0] + blockID[1]);

      illegalMove = check(turn, [
        pieceID,
        positionx + positiony,
        blockID[0] + blockID[1],
      ]);
      console.log(
        pieceID +
          " " +
          (positionx + positiony) +
          " " +
          (blockID[0] + blockID[1])
      );

      // castling
      if (pieceID == "WK" && blockID[0] + blockID[1] == "g1") {
        castleRightW();
        caslted = true;
      }
      if (pieceID == "WK" && blockID[0] + blockID[1] == "c1") {
        castleLeftW();
        caslted = true;
      }
      if (pieceID == "BK" && blockID[0] + blockID[1] == "g8") {
        castleRightB();
        caslted = true;
      }
      if (pieceID == "BK" && blockID[0] + blockID[1] == "c8") {
        castleLeftB();
        caslted = true;
      }
      setChosen(false);
      console.log(possible);

      if (
        (possible.includes(blockID) && colour === turn && !illegalMove) ||
        caslted
      ) {
        if (pieceID == "WK") {
          setKingPositions([blockID[0] + blockID[1], kingPositions[1]]);
          canCastleW = [false, false];
        } else if (pieceID == "BK") {
          setKingPositions([kingPositions[0], blockID[0] + blockID[1]]);
          canCastleW = [false, false];
        }

        // updates positions object
        if (positions[blockID[0] + blockID[1]] && !caslted) {
          if (positions[blockID[0] + blockID[1]][0] == "B") {
            addToBlackTaken(positions[blockID[0] + blockID[1]]);
          } else {
            addToWhiteTaken(positions[blockID[0] + blockID[1]]);
          }
        }

        if (!caslted) {
          positions[blockID[0] + blockID[1]] = pieceID;
          delete positions[positionx + positiony];
          setPositions(positions);
          setBlockID([blockID[0], blockID[1]]);
        }

        // handle castling

        if (pieceID == "WR1") {
          canCastleW[0] = false;
        } else if (pieceID == "WR2") {
          canCastleW[1] = false;
        } else if (pieceID == "BR1") {
          canCastleB[0] = false;
        } else if (pieceID == "BR2") {
          canCastleB[1] = false;
        }

        // handle promotion
        if (blockID[1] == "8" && pieceID.slice(0, 2) == "WP") {
          setSelectPrompt("W");
        }
        if (blockID[1] == "1" && pieceID.slice(0, 2) == "BP") {
          setSelectPrompt("B");
        }

        let Incheck = check(opponent(turn));
        let Inmate = checkMate(opponent(turn));

        if (Inmate) {
          setIsCheckMate(true);
          setWinner(turn + "Checkmate");
          localStorage.clear();
          setTimeout(() => {
            setOpenPrompt("open");
          }, 200);
        }
        if (!Incheck) {
          audio.play();
        } else {
          checkAudio.play();
        }
        localStorage.setItem("chessGameState", JSON.stringify(positions));
        localStorage.setItem(
          "kingLocations",
          JSON.stringify({ locations: kingPositions })
        );
        if (turn == "W") {
          setTurn("B");
          localStorage.setItem("turn", JSON.stringify({ turn: "B" }));
        } else {
          setTurn("W");
          localStorage.setItem("turn", JSON.stringify({ turn: "W" }));
        }
      } else {
        if (turn === "W") {
          setRedHighlightW(true);
          setTimeout(() => {
            setRedHighlightW(false);
          }, 200);
        } else {
          setRedHighlightB(true);
          setTimeout(() => {
            setRedHighlightB(false);
          }, 200);
        }
        illegalMoveAudio.play();
      }
      setChosen(false);
    }
  };

  return (
    <div className="chessBoard">
      <div className={`container ${allowFlip ? turn : ""}`}>
        <svg
          onClick={squareEventListener}
          onDrop={squareEventListener}
          onDragOver={(e) => e.preventDefault()}
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ref={boardRef}
        >
          <path id="d8" d="M90 0H120V30H90V0Z" fill="#b58863" />
          <path id="h8" d="M210 0H240V30H210V0Z" fill="#b58863" />
          <path id="f8" d="M150 0H180V30H150V0Z" fill="#b58863" />
          <path id="b8" d="M30 0H60V30H30V0Z" fill="#b58863" />
          <path id="c3" d="M60 150H90V180H60V150Z" fill="#b58863" />
          <path id="g3" d="M180 150H210V180H180V150Z" fill="#b58863" />
          <path id="e3" d="M120 150H150V180H120V150Z" fill="#b58863" />
          <path id="a3" d="M0 150H30V180H0V150Z" fill="#b58863" />
          <path id="d2" d="M90 180H120V210H90V180Z" fill="#b58863" />
          <path id="h2" d="M210 180H240V210H210V180Z" fill="#b58863" />
          <path id="f2" d="M150 180H180V210H150V180Z" fill="#b58863" />
          <path id="b2" d="M30 180H60V210H30V180Z" fill="#b58863" />
          <path id="d4" d="M90 120H120V150H90V120Z" fill="#b58863" />
          <path id="h4" d="M210 120H240V150H210V120Z" fill="#b58863" />
          <path id="f4" d="M150 120H180V150H150V120Z" fill="#b58863" />
          <path id="b4" d="M30 120H60V150H30V120Z" fill="#b58863" />
          <path id="d8" d="M90 0H120V30H90V0Z" fill="#b58863" />
          <path id="h8" d="M210 0H240V30H210V0Z" fill="#b58863" />
          <path id="f8" d="M150 0H180V30H150V0Z" fill="#b58863" />
          <path id="b8" d="M30 0H60V30H30V0Z" fill="#b58863" />
          <path id="c5" d="M60 90H90V120H60V90Z" fill="#b58863" />
          <path id="a5" d="M0 90H30V120H0V90Z" fill="#b58863" />
          <path id="g5" d="M180 90H210V120H180V90Z" fill="#b58863" />
          <path id="e5" d="M120 90H150V120H120V90Z" fill="#b58863" />
          <path id="d6" d="M90 60H120V90H90V60Z" fill="#b58863" />
          <path id="h6" d="M210 60H240V90H210V60Z" fill="#b58863" />
          <path id="f6" d="M150 60H180V90H150V60Z" fill="#b58863" />
          <path id="b6" d="M30 60H60V90H30V60Z" fill="#b58863" />
          <path id="c7" d="M60 30H90V60H60V30Z" fill="#b58863" />
          <path id="g7" d="M180 30H210V60H180V30Z" fill="#b58863" />
          <path id="e7" d="M120 30H150V60H120V30Z" fill="#b58863" />
          <path id="a7" d="M0 30H30V60H0V30Z" fill="#b58863" />
          <path id="c1" d="M60 210H90V240H60V210Z" fill="#b58863" />
          <path id="g1" d="M180 210H210V240H180V210Z" fill="#b58863" />
          <path id="e1" d="M120 210H150V240H120V210Z" fill="#b58863" />
          <path id="a1" d="M0 210H30V240H0V210Z" fill="#b58863" />
          <path id="e8" d="M120 0H150V30H120V0Z" fill="white" />
          <path id="g8" d="M180 0H210V30H180V0Z" fill="white" />
          <path id="c8" d="M60 0H90V30H60V0Z" fill="white" />
          <path id="d3" d="M90 150H120V180H90V150Z" fill="white" />
          <path id="h3" d="M210 150H240V180H210V150Z" fill="white" />
          <path id="f3" d="M150 150H180V180H150V150Z" fill="white" />
          <path id="b3" d="M30 150H60V180H30V150Z" fill="white" />
          <path id="e2" d="M120 180H150V210H120V180Z" fill="white" />
          <path id="g2" d="M180 180H210V210H180V180Z" fill="white" />
          <path id="c2" d="M60 180H90V210H60V180Z" fill="white" />
          <path id="e4" d="M120 120H150V150H120V120Z" fill="white" />
          <path id="g4" d="M180 120H210V150H180V120Z" fill="white" />
          <path id="c4" d="M60 120H90V150H60V120Z" fill="white" />
          <path id="e8" d="M120 0H150V30H120V0Z" fill="white" />
          <path id="g8" d="M180 0H210V30H180V0Z" fill="white" />
          <path id="c8" d="M60 0H90V30H60V0Z" fill="white" />
          <path id="d5" d="M90 90H120V120H90V90Z" fill="white" />
          <path id="b5" d="M30 90H60V120H30V90Z" fill="white" />
          <path id="h5" d="M210 90H240V120H210V90Z" fill="white" />
          <path id="f5" d="M150 90H180V120H150V90Z" fill="white" />
          <path id="e6" d="M120 60H150V90H120V60Z" fill="white" />
          <path id="g6" d="M180 60H210V90H180V60Z" fill="white" />
          <path id="c6" d="M60 60H90V90H60V60Z" fill="white" />
          <path id="d7" d="M90 30H120V60H90V30Z" fill="white" />
          <path id="h7" d="M210 30H240V60H210V30Z" fill="white" />
          <path id="f7" d="M150 30H180V60H150V30Z" fill="white" />
          <path id="b7" d="M30 30H60V60H30V30Z" fill="white" />
          <path id="d1" d="M90 210H120V240H90V210Z" fill="white" />
          <path id="h1" d="M210 210H240V240H210V210Z" fill="white" />
          <path id="f1" d="M150 210H180V240H150V210Z" fill="white" />
          <path id="b1" d="M30 210H60V240H30V210Z" fill="white" />
          <path id="a8" d="M0 0H30V30H0V0Z" fill="white" />
          <path id="a2" d="M0 180H30V210H0V180Z" fill="white" />
          <path id="a4" d="M0 120H30V150H0V120Z" fill="white" />
          <path id="a8" d="M0 0H30V30H0V0Z" fill="white" />
          <path id="a6" d="M0 60H30V90H0V60Z" fill="white" />
        </svg>
        {data["possible"].map((pos) => {
          if (pos in positions) {
            return (
              <div
                className={` chessPiece ${pos[0]} v${pos[1]} highlightBigger`}
              ></div>
            );
          } else {
            return (
              <div
                className={` chessPiece ${pos[0]} v${pos[1]} highlight`}
              ></div>
            );
          }
        })}

        <div
          className={` chessPiece ${kingPositions[0][0]} v${
            kingPositions[0][1]
          } ${redHighlightW ? "redHighlight" : ""}`}
        ></div>
        <div
          className={` chessPiece ${kingPositions[1][0]} v${
            kingPositions[1][1]
          } ${redHighlightB ? "redHighlight" : ""}`}
        ></div>

        <div className="images">
          {Object.entries(positions).map(([key, value]) => {
            return (
              <img
                key={key}
                id={value}
                className={`chessPiece ${value.slice(0, 2)} v${key[1]} ${
                  key[0]
                } `}
                style={{
                  transform: `rotateZ(${value[0] === "B" ? "180deg" : "0deg"})`,
                }}
                draggable="true"
                onDrop={pieceEventListenerDrop}
                onClick={pieceEventListener}
                onDragStart={pieceEventListenerDrag}
                onDragOver={(e) => e.preventDefault()}
                onDrag={handleDrag}
                onDragEnd={handleDrop}
                src={pieceImageFromID(value)}
              />
            );
          })}
          {/* {draggedPiece && (
            <img
              id="ghostPiece"
              src={pieceImageFromID(draggedPiece)}
              alt="ghost piece"
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                pointerEvents: "none",
                width: "45px",
                height: "45px",
                zIndex: 1000,
              }}
            />
          )} */}
        </div>
      </div>
      <PieceSelection
        setSelectPrompt={setSelectPrompt}
        selectPrompt={selectPrompt}
        blockID={blockID}
        positions={positions}
      />
      <button
        className="newGame"
        onClick={(e) => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        New Game
      </button>
    </div>
  );
}

export default ChessBoard;
