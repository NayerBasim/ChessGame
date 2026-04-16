import { Board } from './Board.js';
import { Piece } from '../pieces/Piece.js';
import { Queen } from '../pieces/Queen.js';
import { Rook } from '../pieces/Rook.js';
import { Bishop } from '../pieces/Bishop.js';
import { Knight } from '../pieces/Knight.js';

/**
 * Main ChessGame class that handles all game logic
 */
export class ChessGame {
  constructor() {
    this.board = new Board();
    this.currentTurn = 'W'; // 'W' or 'B'
    this.gameState = 'active'; // 'active', 'check', 'checkmate', 'stalemate'
    this.winner = null;
    this.castlingRights = {
      W: { kingside: true, queenside: true },
      B: { kingside: true, queenside: true }
    };
    this.selectedPiece = null;
    this.selectedPosition = null;
    this.possibleMoves = [];
    this.capturedPieces = {
      W: [], // pieces captured by white
      B: []  // pieces captured by black
    };
    this.moveHistory = [];
    this.isInCheck = { W: false, B: false };
  }

  /**
   * Get current board state
   * @returns {Board} The current board
   */
  getBoard() {
    return this.board;
  }

  /**
   * Get current turn
   * @returns {string} 'W' or 'B'
   */
  getCurrentTurn() {
    return this.currentTurn;
  }

  /**
   * Get game state
   * @returns {string} Current game state
   */
  getGameState() {
    return this.gameState;
  }

  /**
   * Get winner
   * @returns {string|null} Winner or null if game is ongoing
   */
  getWinner() {
    return this.winner;
  }

  /**
   * Get captured pieces
   * @returns {Object} Captured pieces object
   */
  getCapturedPieces() {
    return this.capturedPieces;
  }

  /**
   * Get possible moves for currently selected piece
   * @returns {Array<string>} Array of possible move positions
   */
  getPossibleMoves() {
    return this.possibleMoves;
  }

  /**
   * Get selected piece and position
   * @returns {Object} Selected piece info
   */
  getSelection() {
    return {
      piece: this.selectedPiece,
      position: this.selectedPosition,
      possibleMoves: this.possibleMoves
    };
  }

  /**
   * Check if a color is in check
   * @param {string} color - 'W' or 'B'
   * @returns {boolean} True if in check
   */
  isColorInCheck(color) {
    return this.isInCheck[color];
  }

  /**
   * Select a piece at a given position
   * @param {string} position - Position to select
   * @returns {boolean} True if selection was successful
   */
  selectPiece(position) {
    const piece = this.board.getPieceAt(position);
    
    // Can only select pieces of current player's color
    if (!piece || piece.color !== this.currentTurn) {
      this.clearSelection();
      return false;
    }

    this.selectedPiece = piece;
    this.selectedPosition = position;
    this.possibleMoves = this.getValidMovesForPiece(piece);
    
    return true;
  }

  /**
   * Clear current selection
   */
  clearSelection() {
    this.selectedPiece = null;
    this.selectedPosition = null;
    this.possibleMoves = [];
  }

  /**
   * Attempt to move a piece to a target position
   * @param {string} targetPosition - Target position
   * @returns {Object} Move result object
   */
  attemptMove(targetPosition) {
    if (!this.selectedPiece || !this.selectedPosition) {
      return { success: false, reason: 'No piece selected' };
    }

    if (!this.possibleMoves.includes(targetPosition)) {
      return { success: false, reason: 'Invalid move' };
    }

    return this.makeMove(this.selectedPosition, targetPosition);
  }

  /**
   * Make a move from one position to another
   * @param {string} fromPosition - Starting position
   * @param {string} toPosition - Target position
   * @returns {Object} Move result object
   */
  makeMove(fromPosition, toPosition) {
    const piece = this.board.getPieceAt(fromPosition);
    
    if (!piece || piece.color !== this.currentTurn) {
      return { success: false, reason: 'Invalid piece or not your turn' };
    }

    // Check if move is valid
    const validMoves = this.getValidMovesForPiece(piece);
    if (!validMoves.includes(toPosition)) {
      return { success: false, reason: 'Invalid move' };
    }

    // Check for castling
    const isCastling = piece.type === 'K' && Math.abs(fromPosition.charCodeAt(0) - toPosition.charCodeAt(0)) === 2;

    let capturedPiece = null;
    let rookMove = null;

    if (isCastling) {
      // Handle castling
      const result = this.performCastling(fromPosition, toPosition);
      if (!result.success) {
        return result;
      }
      rookMove = result.rookMove;
    } else {
      // Regular move
      capturedPiece = this.board.movePiece(fromPosition, toPosition);
    }

    // Update castling rights
    this.updateCastlingRights(piece, fromPosition);

    // Record the move
    const moveRecord = {
      from: fromPosition,
      to: toPosition,
      piece: piece.id,
      captured: capturedPiece ? capturedPiece.id : null,
      castling: isCastling,
      rookMove: rookMove,
      turn: this.currentTurn
    };
    this.moveHistory.push(moveRecord);

    // Add captured piece to the opponent's captured list
    if (capturedPiece) {
      this.capturedPieces[this.currentTurn].push(capturedPiece);
    }

    // Check for promotion
    const promotionResult = this.checkForPromotion(piece, toPosition);

    // Switch turns
    this.currentTurn = Piece.getOpponentColor(this.currentTurn);

    // Update game state
    this.updateGameState();

    // Clear selection
    this.clearSelection();

    return {
      success: true,
      move: moveRecord,
      captured: capturedPiece,
      promotion: promotionResult,
      gameState: this.gameState,
      isCheck: this.isColorInCheck(this.currentTurn),
      isCheckmate: this.gameState === 'checkmate'
    };
  }

  /**
   * Get valid moves for a piece (excluding moves that would put own king in check)
   * @param {Piece} piece - The piece to get moves for
   * @returns {Array<string>} Array of valid move positions
   */
  getValidMovesForPiece(piece) {
    let possibleMoves = piece.getPossibleMoves(this.board);

    // Add castling moves for kings
    if (piece.type === 'K') {
      const castlingMoves = piece.getCastlingMoves(this.board, this.castlingRights[piece.color]);
      possibleMoves = [...possibleMoves, ...castlingMoves];
    }

    // Filter out moves that would put own king in check
    const validMoves = possibleMoves.filter(move => {
      return !this.wouldMoveResultInCheck(piece.position, move, piece.color);
    });

    return validMoves;
  }

  /**
   * Check if a move would result in check for the moving player
   * @param {string} fromPosition - Starting position
   * @param {string} toPosition - Target position
   * @param {string} color - Color of the moving piece
   * @returns {boolean} True if move would result in check
   */
  wouldMoveResultInCheck(fromPosition, toPosition, color) {
    // Create a copy of the board and simulate the move
    const boardCopy = this.board.copy();
    boardCopy.movePiece(fromPosition, toPosition);

    return this.isKingInCheckOnBoard(color, boardCopy);
  }

  /**
   * Check if a king is in check on a given board
   * @param {string} color - Color of the king to check
   * @param {Board} board - Board to check on (defaults to current board)
   * @returns {boolean} True if king is in check
   */
  isKingInCheckOnBoard(color, board = this.board) {
    const kingPosition = board.getKingPosition(color);
    if (!kingPosition) return false;

    const opponentColor = Piece.getOpponentColor(color);
    const opponentPieces = board.getPiecesByColor(opponentColor);

    // Check if any opponent piece can attack the king
    for (const piece of opponentPieces) {
      const possibleMoves = piece.getPossibleMoves(board);
      if (possibleMoves.includes(kingPosition)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Update game state (check, checkmate, stalemate)
   */
  updateGameState() {
    const currentPlayer = this.currentTurn;
    const isInCheck = this.isKingInCheckOnBoard(currentPlayer);
    
    this.isInCheck[currentPlayer] = isInCheck;
    this.isInCheck[Piece.getOpponentColor(currentPlayer)] = false;

    // Check if current player has any valid moves
    const playerPieces = this.board.getPiecesByColor(currentPlayer);
    let hasValidMoves = false;

    for (const piece of playerPieces) {
      const validMoves = this.getValidMovesForPiece(piece);
      if (validMoves.length > 0) {
        hasValidMoves = true;
        break;
      }
    }

    if (!hasValidMoves) {
      if (isInCheck) {
        this.gameState = 'checkmate';
        this.winner = Piece.getOpponentColor(currentPlayer);
      } else {
        this.gameState = 'stalemate';
      }
    } else if (isInCheck) {
      this.gameState = 'check';
    } else {
      this.gameState = 'active';
    }
  }

  /**
   * Perform castling move
   * @param {string} fromPosition - King's starting position
   * @param {string} toPosition - King's target position
   * @returns {Object} Result object
   */
  performCastling(fromPosition, toPosition) {
    const king = this.board.getPieceAt(fromPosition);
    if (!king || king.type !== 'K') {
      return { success: false, reason: 'Not a king' };
    }

    const color = king.color;
    const rank = color === 'W' ? '1' : '8';
    
    let rookFromPos, rookToPos;
    
    if (toPosition === 'g' + rank) {
      // Kingside castling
      rookFromPos = 'h' + rank;
      rookToPos = 'f' + rank;
    } else if (toPosition === 'c' + rank) {
      // Queenside castling
      rookFromPos = 'a' + rank;
      rookToPos = 'd' + rank;
    } else {
      return { success: false, reason: 'Invalid castling move' };
    }

    // Move king and rook
    this.board.movePiece(fromPosition, toPosition);
    this.board.movePiece(rookFromPos, rookToPos);

    return {
      success: true,
      rookMove: { from: rookFromPos, to: rookToPos }
    };
  }

  /**
   * Update castling rights based on piece movement
   * @param {Piece} piece - The piece that moved
   * @param {string} fromPosition - Starting position
   */
  updateCastlingRights(piece, fromPosition) {
    const color = piece.color;
    
    // King moves
    if (piece.type === 'K') {
      this.castlingRights[color].kingside = false;
      this.castlingRights[color].queenside = false;
    }
    
    // Rook moves
    if (piece.type === 'R') {
      const rank = color === 'W' ? '1' : '8';
      if (fromPosition === 'a' + rank) {
        this.castlingRights[color].queenside = false;
      } else if (fromPosition === 'h' + rank) {
        this.castlingRights[color].kingside = false;
      }
    }
  }

  /**
   * Check for pawn promotion
   * @param {Piece} piece - The piece that moved
   * @param {string} position - The position moved to
   * @returns {Object|null} Promotion info or null
   */
  checkForPromotion(piece, position) {
    if (piece.type !== 'P') return null;
    
    const rank = parseInt(position[1]);
    const promotionRank = piece.color === 'W' ? 8 : 1;
    
    if (rank === promotionRank) {
      return {
        position: position,
        color: piece.color,
        needsSelection: true
      };
    }
    
    return null;
  }

  /**
   * Promote a pawn to a new piece type
   * @param {string} position - Position of the pawn to promote
   * @param {string} newPieceType - Type to promote to ('Q', 'R', 'B', 'N')
   * @returns {boolean} True if promotion was successful
   */
  promotePawn(position, newPieceType) {
    const piece = this.board.getPieceAt(position);
    if (!piece || piece.type !== 'P') {
      return false;
    }

    // Remove the pawn
    this.board.removePiece(position);

    // Create new piece
    const color = piece.color;
    const id = color + newPieceType + 'P'; // e.g., 'WQP' for promoted queen
    
    let newPiece;
    switch (newPieceType) {
      case 'Q':
        newPiece = new Queen(color, id, position);
        break;
      case 'R':
        newPiece = new Rook(color, id, position);
        break;
      case 'B':
        newPiece = new Bishop(color, id, position);
        break;
      case 'N':
        newPiece = new Knight(color, id, position);
        break;
      default:
        return false;
    }

    // Place new piece
    this.board.placePiece(newPiece, position);
    return true;
  }

  /**
   * Save game state to localStorage
   */
  saveToLocalStorage() {
    const gameState = {
      positions: this.board.toPositionObject(),
      currentTurn: this.currentTurn,
      kingPositions: {
        W: this.board.getKingPosition('W'),
        B: this.board.getKingPosition('B')
      },
      castlingRights: this.castlingRights,
      capturedPieces: this.capturedPieces,
      gameState: this.gameState,
      winner: this.winner
    };

    localStorage.setItem('chessGameState', JSON.stringify(gameState.positions));
    localStorage.setItem('turn', JSON.stringify({ turn: this.currentTurn }));
    localStorage.setItem('kingLocations', JSON.stringify({ locations: [
      gameState.kingPositions.W,
      gameState.kingPositions.B
    ]}));
  }

  /**
   * Load game state from localStorage
   */
  loadFromLocalStorage() {
    try {
      const savedPositions = localStorage.getItem('chessGameState');
      const savedTurn = localStorage.getItem('turn');
      const savedKingLocations = localStorage.getItem('kingLocations');

      if (savedPositions && savedTurn) {
        const positions = JSON.parse(savedPositions);
        const turn = JSON.parse(savedTurn);
        
        this.board.fromPositionObject(positions);
        this.currentTurn = turn.turn;
        
        // Update game state
        this.updateGameState();
        
        return true;
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
    
    return false;
  }

  /**
   * Reset the game to initial state
   */
  resetGame() {
    this.board = new Board();
    this.currentTurn = 'W';
    this.gameState = 'active';
    this.winner = null;
    this.castlingRights = {
      W: { kingside: true, queenside: true },
      B: { kingside: true, queenside: true }
    };
    this.selectedPiece = null;
    this.selectedPosition = null;
    this.possibleMoves = [];
    this.capturedPieces = { W: [], B: [] };
    this.moveHistory = [];
    this.isInCheck = { W: false, B: false };
    
    localStorage.clear();
  }

  /**
   * Get board state in original component format
   * @returns {Object} Position object compatible with original component
   */
  getPositionsForView() {
    return this.board.toPositionObject();
  }

  /**
   * Get king positions in original component format
   * @returns {Array<string>} Array of king positions [whiteKingPos, blackKingPos]
   */
  getKingPositionsForView() {
    return [
      this.board.getKingPosition('W') || 'e1',
      this.board.getKingPosition('B') || 'e8'
    ];
  }
}
