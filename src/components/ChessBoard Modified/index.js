import "./index.scss";
import { useState, useRef, useEffect } from "react";
import Timer from "../Timer";
import sound from "../../media/knock.mp3";
import checkSound from "../../media/snap-sound-effect.mp3";
import illegalSound from "../../media/metal-vibration.mp3";
import PieceSelection from "../PieceSelection";
import { ChessGame } from "./logic/ChessGame.js";

// Helper function to get piece image from ID
function pieceImageFromID(id) {
  const map = {
    WK: require('../../media/king-w.svg').default,
    WQ: require('../../media/queen-w.svg').default,
    WR: require('../../media/rook-w.svg').default,
    WB: require('../../media/bishop-w.svg').default,
    WN: require('../../media/knight-w.svg').default,
    WP: require('../../media/pawn-w.svg').default,

    BK: require('../../media/king-b.svg').default,
    BQ: require('../../media/queen-b.svg').default,
    BR: require('../../media/rook-b.svg').default,
    BB: require('../../media/bishop-b.svg').default,
    BN: require('../../media/knight-b.svg').default,
    BP: require('../../media/pawn-b.svg').default,
  };

  // Take just the piece type (e.g. "WP" from "WP1", "WR2")
  const prefix = id.slice(0, 2);
  return map[prefix] || "";
}

function ChessBoardModified({
  player,
  turn,
  setTurn,
  setOpenPrompt,
  setWinner,
  allowFlip,
  addToWhiteTaken,
  addToBlackTaken,
}) {
  // Initialize the chess game instance
  const [game] = useState(() => new ChessGame());
  
  // UI state
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [selectPrompt, setSelectPrompt] = useState(null);
  const [blockID, setBlockID] = useState(["", ""]);
  const [redHighlightW, setRedHighlightW] = useState(false);
  const [redHighlightB, setRedHighlightB] = useState(false);
  
  // Game state derived from ChessGame instance
  const [positions, setPositions] = useState(() => game.getPositionsForView());
  const [kingPositions, setKingPositions] = useState(() => game.getKingPositionsForView());
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [selectedPieceId, setSelectedPieceId] = useState("");
  const [isCheckMate, setIsCheckMate] = useState(false);

  const boardRef = useRef(null);
  
  // Audio setup
  const checkAudio = new Audio(checkSound);
  const illegalMoveAudio = new Audio(illegalSound);
  const audio = new Audio(sound);
  checkAudio.playbackRate = 2.5;
  audio.playbackRate = 2.5;
  illegalMoveAudio.playbackRate = 2.5;

  // Load saved game state on component mount
  useEffect(() => {
    if (game.loadFromLocalStorage()) {
      updateUIFromGame();
    }
  }, [game]);

  // Clear selection when turn changes
  useEffect(() => {
    game.clearSelection();
    setPossibleMoves([]);
    setSelectedPieceId("");
  }, [turn, game]);

  /**
   * Update UI state from the game instance
   */
  const updateUIFromGame = () => {
    setPositions(game.getPositionsForView());
    setKingPositions(game.getKingPositionsForView());
    setTurn(game.getCurrentTurn());
    
    const selection = game.getSelection();
    setPossibleMoves(selection.possibleMoves);
    setSelectedPieceId(selection.piece ? selection.piece.id : "");
    
    setIsCheckMate(game.getGameState() === 'checkmate');
  };

  /**
   * Handle piece selection
   */
  const handlePieceClick = (pieceId, position) => {
    // If there's already a selected piece and this click is on a valid move
    if (selectedPieceId && possibleMoves.includes(position)) {
      handleMove(position);
      return;
    }

    // Select the clicked piece
    const success = game.selectPiece(position);
    if (success) {
      const selection = game.getSelection();
      setPossibleMoves(selection.possibleMoves);
      setSelectedPieceId(selection.piece.id);
    } else {
      // Clear selection if invalid piece clicked
      game.clearSelection();
      setPossibleMoves([]);
      setSelectedPieceId("");
    }
  };

  /**
   * Handle square click (for moves)
   */
  const handleSquareClick = (position) => {
    if (selectedPieceId && possibleMoves.includes(position)) {
      handleMove(position);
    } else {
      // Clear selection if clicking empty square
      game.clearSelection();
      setPossibleMoves([]);
      setSelectedPieceId("");
    }
  };

  /**
   * Handle move attempt
   */
  const handleMove = (targetPosition) => {
    const moveResult = game.attemptMove(targetPosition);
    
    if (moveResult.success) {
      // Update UI state
      updateUIFromGame();
      
      // Handle captured pieces
      if (moveResult.captured) {
        if (moveResult.captured.color === 'B') {
          addToBlackTaken(moveResult.captured.id);
        } else {
          addToWhiteTaken(moveResult.captured.id);
        }
      }

      // Handle promotion
      if (moveResult.promotion && moveResult.promotion.needsSelection) {
        setSelectPrompt(moveResult.promotion.color);
        setBlockID([targetPosition[0], targetPosition[1]]);
      }

      // Handle game end
      if (moveResult.isCheckmate) {
        setIsCheckMate(true);
        setWinner(game.getWinner() + "Checkmate");
        localStorage.clear();
        setTimeout(() => {
          setOpenPrompt("open");
        }, 200);
      }

      // Play appropriate sound
      if (moveResult.isCheck) {
        checkAudio.play();
      } else {
        audio.play();
      }

      // Save game state
      game.saveToLocalStorage();
      
    } else {
      // Handle illegal move
      const currentPlayer = game.getCurrentTurn();
      if (currentPlayer === "W") {
        setRedHighlightW(true);
        setTimeout(() => setRedHighlightW(false), 200);
      } else {
        setRedHighlightB(true);
        setTimeout(() => setRedHighlightB(false), 200);
      }
      
      illegalMoveAudio.play();
      
      // Clear selection
      game.clearSelection();
      setPossibleMoves([]);
      setSelectedPieceId("");
    }
  };

  /**
   * Get the position from element classList
   */
  const getPositionFromClassList = (classList) => {
    const file = classList[3]; // file (a-h)
    const rank = classList[2][1]; // rank (1-8)
    return file + rank;
  };

  /**
   * Handle drag start
   */
  const handleDragStart = (e, pieceId) => {
    setDraggedPiece(pieceId);
    e.dataTransfer.setData("text/plain", pieceId);
    e.target.style.opacity = "0.2";
    
    // Select the piece being dragged
    const position = getPositionFromElement(e.target);
    handlePieceClick(pieceId, position);
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = (e) => {
    setDraggedPiece(null);
    e.target.style.opacity = "1";
  };

  /**
   * Handle drop
   */
  const handleDrop = (e) => {
    e.preventDefault();
    const position = getPositionFromClassList(e.target.classList);
    if (selectedPieceId && possibleMoves.includes(position)) {
      handleMove(position);
    }
  };

  /**
   * Get position from DOM element
   */
  const getPositionFromElement = (element) => {
    const classList = element.classList;
    return getPositionFromClassList(classList);
  };

  /**
   * Handle new game
   */
  const handleNewGame = () => {
    game.resetGame();
    updateUIFromGame();
    setSelectPrompt(null);
    setBlockID(["", ""]);
    setRedHighlightW(false);
    setRedHighlightB(false);
    window.location.reload();
  };

  /**
   * Get opponent color
   */
  const getOpponentColor = (color) => {
    return color === 'W' ? 'B' : 'W';
  };

  return (
    <div className="chessBoard">
      <div className={`container ${allowFlip ? turn : ""}`}>
        <svg
          onClick={(e) => {
            const position = e.target.id;
            if (position && position.length === 2) {
              handleSquareClick(position);
            }
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ref={boardRef}
        >
          {/* Board squares - keeping the original SVG structure */}
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
          <path id="a6" d="M0 60H30V90H0V60Z" fill="white" />
        </svg>

        {/* Render possible move highlights */}
        {selectedPieceId && selectedPieceId[0] !== getOpponentColor(turn) && possibleMoves.map((pos) => {
          const isCapture = positions[pos];
          return (
            <div
              key={pos}
              className={`chessPiece ${pos[0]} v${pos[1]} ${isCapture ? 'highlightBigger' : 'highlight'}`}
            />
          );
        })}

        {/* King highlight for check */}
        <div
          className={`chessPiece ${kingPositions[0][0]} v${kingPositions[0][1]} ${redHighlightW ? "redHighlight" : ""}`}
        />
        <div
          className={`chessPiece ${kingPositions[1][0]} v${kingPositions[1][1]} ${redHighlightB ? "redHighlight" : ""}`}
        />

        {/* Render pieces */}
        <div className="images">
          {Object.entries(positions).map(([position, pieceId]) => {
            const shouldFlip = pieceId[0] === "B";
            return (
              <img
                key={position}
                id={pieceId}
                className={`chessPiece ${pieceId.slice(0, 2)} v${position[1]} ${position[0]}`}
                style={{
                  transform: shouldFlip ? "rotateZ(180deg)" : "rotateZ(0deg)",
                  cursor: 'grab',
                }}
                draggable="true"
                onClick={(e) => {
                  const pos = getPositionFromElement(e.target);
                  handlePieceClick(pieceId, pos);
                }}
                onDragStart={(e) => handleDragStart(e, pieceId)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                src={pieceImageFromID(pieceId)}
                alt={`${pieceId}`}
              />
            );
          })}
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
        onClick={handleNewGame}
      >
        New Game
      </button>
    </div>
  );
}

export default ChessBoardModified;
