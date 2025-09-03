import {
  opponent,
  whitePawnMoves,
  blackPawnMoves,
  knightMoves,
  bishopMoves,
  rookMoves,
  kingMoves,
  queenMoves,
  castleRightW,
  castleLeftW,
  castleRightB,
  castleLeftB
  } from "./pieceMovements";
import sound from "../../../media/knock.mp3";
import checkSound from "../../../media/snap-sound-effect.mp3";
import illegalSound from "../../../media/metal-vibration.mp3";



// audio features
const checkAudio = new Audio(checkSound);
const illegalMoveAudio = new Audio(illegalSound);
const audio = new Audio(sound);
checkAudio.playbackRate = 2.5;
audio.playbackRate = 2.5;
illegalMoveAudio.playbackRate = 2.5;



//   const checkIllegal = (king, moves, positionx, positiony) => {
//     let adjustedMoves = [];
//     let oldPosition = positionx + positiony;
//     moves.forEach((possibility) => {
//       if (
//         !check(king, [
//           positions[positionx + positiony],
//           oldPosition,
//           possibility,
//         ])
//       ) {
//         adjustedMoves.push(possibility);
//       }
//     });
//     return adjustedMoves;
//   };



export const playTurn = (
  id, possible, positionx, positiony, gameContext
) => {
    // selection["id"] is the piece being moved, which should be available from possible or positions
    // In the previous code, selection["id"] was passed as an argument. Now, we need to infer it.
    // The most reliable way is to get it from positions[positionx + positiony]
    let {
      positions,
      chosen,
      turn,
      kingPositions,
      canCastleW,
      canCastleB,
      setChosen,
      setKingPositions,
      addToBlackTaken,
      addToWhiteTaken,
      setBlockID,
      setSelectPrompt,
      setIsCheckMate,
      setWinner,
      setOpenPrompt,
      setTurn,
      setPositions,
      setRedHighlightW,
      setRedHighlightB,
      selection,
      setSelection
    } = gameContext;



    let illegalMove;

    if (chosen == true) {


      let colour = selection["id"][0];
      let blockID = id;
      let castled = false;


      illegalMove = check(turn,positions,kingPositions,gameContext, [
        selection["id"],
        positionx + positiony,
        blockID[0] + blockID[1],
      ]);
      console.log(
        "illegal"+
        selection["id"] +
          " " +
          (positionx + positiony) +
          " " +
          (blockID[0] + blockID[1])
      );

      // castling
      if (selection["id"] == "WK" && blockID[0] + blockID[1] == "g1") {
        castleRightW();
        castled = true;
      }
      if (selection["id"] == "WK" && blockID[0] + blockID[1] == "c1") {
        castleLeftW();
        castled = true;
      }
      if (selection["id"] == "BK" && blockID[0] + blockID[1] == "g8") {
        castleRightB();
        castled = true;
      }
      if (selection["id"] == "BK" && blockID[0] + blockID[1] == "c8") {
        castleLeftB();
        castled = true;
      }
      setChosen(false);


      if (
        (possible.includes(blockID) && colour === turn && !illegalMove) ||
        castled
      ) {
        if (selection["id"] == "WK") {
          setKingPositions([blockID[0] + blockID[1], kingPositions[1]]);
          canCastleW = [false, false];
        } else if (selection["id"] == "BK") {
          setKingPositions([kingPositions[0], blockID[0] + blockID[1]]);
          canCastleW = [false, false];
        }

        // updates positions object
        if (positions[blockID[0] + blockID[1]] && !castled) {
          if (positions[blockID[0] + blockID[1]][0] == "B") {
            addToBlackTaken(positions[blockID[0] + blockID[1]]);
          } else {
            addToWhiteTaken(positions[blockID[0] + blockID[1]]);
          }
        }

        if (!castled) {
          const newPositions = { ...positions };
          newPositions[blockID[0] + blockID[1]] = selection["id"];
          delete newPositions[positionx + positiony];
          setPositions(newPositions);
          setBlockID([blockID[0], blockID[1]]);
        }

        // handle castling

        if (selection["id"] == "WR1") {
          canCastleW[0] = false;
        } else if (selection["id"] == "WR2") {
          canCastleW[1] = false;
        } else if (selection["id"] == "BR1") {
          canCastleB[0] = false;
        } else if (selection["id"] == "BR2") {
          canCastleB[1] = false;
        }

        // handle promotion
        if (blockID[1] == "8" && selection["id"].slice(0, 2) == "WP") {
          setSelectPrompt("W");
        }
        if (blockID[1] == "1" && selection["id"].slice(0, 2) == "BP") {
          setSelectPrompt("B");
        }

        let Incheck = check(opponent(turn),positions,kingPositions,gameContext, []);
        let Inmate = checkMate(opponent(turn),positions,kingPositions,gameContext, []);
        // let Inmate = false;
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
      setSelection({
        possible: [],
        id: "",
        positionx: "",
        positiony: ""
      })
    }
  };


const getPossibleMoves = (
    type,
    positionx,
    positiony,
    possible,
    positions,
    setSelection
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
        possible = [];
        console.log("Error");
        break;
    }

    return possible;
  };

  // handles the logic of the game by assigning possible positions
  // the pieces can move and is initiated by clicking on a square

  export const handlePieceLogic = (
    classList, id, selection, gameContextOrGame, game
  ) => {


    // Defensive: if positions is undefined or null, return empty array
    if (!gameContextOrGame || !gameContextOrGame.positions) {
      return [];
    }
    let gameContext = gameContextOrGame;
    let {
      positions,
      chosen,
      turn,
      ischeckMate,
      setChosen,
      setSelection = undefined // default to undefined if not provided
    } = gameContext;



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
        selection["possible"].includes(positionx + positiony) &&
        turn == selection["id"][0]
      ) {
        if (
          positions[positionx + positiony][0] != selection["id"][0] &&
          ischeckMate == false
        ) {
          let el = document.getElementById(id);
          // // el.classList.add("out");
          // delete positions[positionx + positiony];
          playTurn(
            positionx + positiony,
            selection["possible"],
            selection["positionx"],
            selection["positiony"],
            gameContext
          );
          return;
        }
      }
    }

    // LOGIC FOR EACH PIECE
    possible = getPossibleMoves(type, positionx, positiony, possible, positions);
    if (typeof setSelection === 'function') {
      setSelection((prev) => ({
        ...prev,
        possible:possible,
      }));
    }

    // logs the data to be used when a block is clicked

    if (game) {
      setChosen(true);
      setSelection((prev) => ({
        ...prev,
        possible: getPossibleMoves(type, positionx, positiony, possible, positions),
        id: id,
        positionx: positionx,
        positiony: positiony
      }));

      return [];
    } else {
      return possible;
    }
  };

  
//   export const handleLogicDrag = (
//     classList, id, selection, gameContext, game = true
//   ) => {
//     let possible = []; //stores possible move positions

//     // gets the pice along with its position on the board
//     let type = classList[1];
//     let positiony = parseInt(classList[2][1]);
//     let positionx = classList[3];

//       getPossibleMoves(type, positionx, positiony, possible, gameContext.positions);
//     // LOGIC FOR EACH PIECE

//     // logs the data to be used when a block is clicked

//     if (game) {
//       gameContext.setChosen(true);
//       selection["possible"] = possible;
//       selection["positionx"] = positionx;
//       selection["positiony"] = positiony;
//       selection["id"] = id;
//       return 1;
//     } else {
//       return possible;
//     }
//   };

  export const handleLogicDrop = (
    classList, id, selection, gameContext, game = true
  ) => {

    let positiony = parseInt(classList[2][1]);
    let positionx = classList[3];
      if (game) {
        const {
          positions,
          chosen,
          turn,
          ischeckMate
        } = gameContext;
        if (
          chosen == true &&
          selection["possible"].includes(positionx + positiony) &&
          turn == selection["id"][0]
        ) {
          if (
            positions[positionx + positiony][0] != selection["id"][0] &&
            ischeckMate == false
          ) {
            let el = document.getElementById(id);
            playTurn(
              positionx + positiony,
              selection["possible"],
              selection["positionx"],
              selection["positiony"],
              gameContext
            );
          }
        }
      }
  };


  
  // detects checks


  // detects checks
  const check = (king, positions, kingPositions, gameContext, exceptions = []) => {
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
        possible = handlePieceLogic(
          element.classList,
          element.id,
          gameContext.selection,
          gameContext,
          false
        );
        allpossible = allpossible.concat(possible);
        console.log("possible",element.id, possible);
      }
    }
    console.log("allpossible", allpossible);
    console.log("kingPositionsUsed", kingPositionsUsed);
    console.log(allpossible.includes(kingPositionsUsed[0]), allpossible.includes(kingPositionsUsed[1]));

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

    const checkMate = (king, positions, kingPositions, gameContext) => {
    //loop through each piece object
    //   get possible moves for the piece
    //   run check()
    //   check if check() if false to return false
    //otherwise return true'

    let flag = true;
    console.log("Mate");

    let elements = [];

    for (let id of Object.values(positions)) {
      elements.push(document.getElementById(id));
    }

    for (let element of elements) {
      if (element.id[0] == king) {
        let possible = handlePieceLogic(
          element.classList,
          element.id,
          positions,
            gameContext,
          false
        );
        console.log("possible for " + element.id, possible);
        possible.forEach((possibility) => {
          let oldPosition =
            element.classList[3] + parseInt(element.classList[2][1]);
           console.log("the val of the check " + check(king, positions, kingPositions, gameContext, [element.id, oldPosition, possibility]));
          if (!check(king, positions, kingPositions, gameContext, [element.id, oldPosition, possibility])) {
            flag = false;
            console.log(element.id + " " + oldPosition + " " + possibility);
          }
        });
      }
    }
    console.log("checkmate is " + flag);
    return flag;
  };