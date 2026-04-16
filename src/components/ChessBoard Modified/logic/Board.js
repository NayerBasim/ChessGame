import { Pawn } from '../pieces/Pawn.js';
import { Rook } from '../pieces/Rook.js';
import { Knight } from '../pieces/Knight.js';
import { Bishop } from '../pieces/Bishop.js';
import { Queen } from '../pieces/Queen.js';
import { King } from '../pieces/King.js';

/**
 * Board class to manage piece positions and board state
 */
export class Board {
  constructor() {
    this.pieces = new Map(); // position -> piece
    this.initializeBoard();
  }

  /**
   * Initialize the board with starting positions
   */
  initializeBoard() {
    // Clear the board
    this.pieces.clear();

    // White pieces
    this.placePiece(new Rook('W', 'WR1', 'a1'), 'a1');
    this.placePiece(new Knight('W', 'WN1', 'b1'), 'b1');
    this.placePiece(new Bishop('W', 'WB1', 'c1'), 'c1');
    this.placePiece(new Queen('W', 'WQ', 'd1'), 'd1');
    this.placePiece(new King('W', 'WK', 'e1'), 'e1');
    this.placePiece(new Bishop('W', 'WB2', 'f1'), 'f1');
    this.placePiece(new Knight('W', 'WN2', 'g1'), 'g1');
    this.placePiece(new Rook('W', 'WR2', 'h1'), 'h1');

    // White pawns
    for (let i = 0; i < 8; i++) {
      const file = String.fromCharCode('a'.charCodeAt(0) + i);
      const position = file + '2';
      this.placePiece(new Pawn('W', `WP${i + 1}`, position), position);
    }

    // Black pieces
    this.placePiece(new Rook('B', 'BR1', 'a8'), 'a8');
    this.placePiece(new Knight('B', 'BN1', 'b8'), 'b8');
    this.placePiece(new Bishop('B', 'BB1', 'c8'), 'c8');
    this.placePiece(new Queen('B', 'BQ', 'd8'), 'd8');
    this.placePiece(new King('B', 'BK', 'e8'), 'e8');
    this.placePiece(new Bishop('B', 'BB2', 'f8'), 'f8');
    this.placePiece(new Knight('B', 'BN2', 'g8'), 'g8');
    this.placePiece(new Rook('B', 'BR2', 'h8'), 'h8');

    // Black pawns
    for (let i = 0; i < 8; i++) {
      const file = String.fromCharCode('a'.charCodeAt(0) + i);
      const position = file + '7';
      this.placePiece(new Pawn('B', `BP${i + 1}`, position), position);
    }
  }

  /**
   * Place a piece on the board
   * @param {Piece} piece - The piece to place
   * @param {string} position - Position to place the piece
   */
  placePiece(piece, position) {
    this.pieces.set(position, piece);
    piece.position = position;
  }

  /**
   * Remove a piece from the board
   * @param {string} position - Position to remove piece from
   * @returns {Piece|null} The removed piece or null if no piece was there
   */
  removePiece(position) {
    const piece = this.pieces.get(position);
    if (piece) {
      this.pieces.delete(position);
      return piece;
    }
    return null;
  }

  /**
   * Get piece at a specific position
   * @param {string} position - Position to check
   * @returns {Piece|null} The piece at that position or null if empty
   */
  getPieceAt(position) {
    return this.pieces.get(position) || null;
  }

  /**
   * Move a piece from one position to another
   * @param {string} fromPosition - Starting position
   * @param {string} toPosition - Target position
   * @returns {Piece|null} The captured piece if any
   */
  movePiece(fromPosition, toPosition) {
    const piece = this.getPieceAt(fromPosition);
    if (!piece) {
      return null;
    }

    // Capture any piece at target position
    const capturedPiece = this.removePiece(toPosition);
    
    // Move the piece
    this.removePiece(fromPosition);
    this.placePiece(piece, toPosition);
    piece.moveTo(toPosition);

    return capturedPiece;
  }

  /**
   * Get all pieces of a specific color
   * @param {string} color - 'W' or 'B'
   * @returns {Array<Piece>} Array of pieces
   */
  getPiecesByColor(color) {
    return Array.from(this.pieces.values()).filter(piece => piece.color === color);
  }

  /**
   * Find the king of a specific color
   * @param {string} color - 'W' or 'B'
   * @returns {Piece|null} The king piece or null if not found
   */
  getKing(color) {
    return Array.from(this.pieces.values()).find(piece => 
      piece.color === color && piece.type === 'K'
    ) || null;
  }

  /**
   * Get the position of the king of a specific color
   * @param {string} color - 'W' or 'B'
   * @returns {string|null} King position or null if not found
   */
  getKingPosition(color) {
    const king = this.getKing(color);
    return king ? king.position : null;
  }

  /**
   * Create a copy of the board for simulation purposes
   * @returns {Board} A new Board instance with copied state
   */
  copy() {
    const newBoard = new Board();
    newBoard.pieces.clear();

    // Copy all pieces
    for (const [position, piece] of this.pieces.entries()) {
      let newPiece;
      switch (piece.type) {
        case 'P':
          newPiece = new Pawn(piece.color, piece.id, position);
          break;
        case 'R':
          newPiece = new Rook(piece.color, piece.id, position);
          break;
        case 'N':
          newPiece = new Knight(piece.color, piece.id, position);
          break;
        case 'B':
          newPiece = new Bishop(piece.color, piece.id, position);
          break;
        case 'Q':
          newPiece = new Queen(piece.color, piece.id, position);
          break;
        case 'K':
          newPiece = new King(piece.color, piece.id, position);
          break;
        default:
          continue;
      }
      newPiece.hasMoved = piece.hasMoved;
      newBoard.pieces.set(position, newPiece);
    }

    return newBoard;
  }

  /**
   * Convert board state to a format compatible with the original component
   * @returns {Object} Position object in original format
   */
  toPositionObject() {
    const positions = {};
    for (const [position, piece] of this.pieces.entries()) {
      positions[position] = piece.id;
    }
    return positions;
  }

  /**
   * Load board state from position object (original format)
   * @param {Object} positions - Position object from original format
   */
  fromPositionObject(positions) {
    this.pieces.clear();

    for (const [position, pieceId] of Object.entries(positions)) {
      const color = pieceId[0]; // 'W' or 'B'
      const type = pieceId[1]; // 'P', 'R', 'N', 'B', 'Q', 'K'
      
      let piece;
      switch (type) {
        case 'P':
          piece = new Pawn(color, pieceId, position);
          break;
        case 'R':
          piece = new Rook(color, pieceId, position);
          break;
        case 'N':
          piece = new Knight(color, pieceId, position);
          break;
        case 'B':
          piece = new Bishop(color, pieceId, position);
          break;
        case 'Q':
          piece = new Queen(color, pieceId, position);
          break;
        case 'K':
          piece = new King(color, pieceId, position);
          break;
        default:
          continue;
      }

      // Determine if piece has moved based on position
      if (type === 'P') {
        const startingRank = color === 'W' ? '2' : '7';
        piece.hasMoved = position[1] !== startingRank;
      } else if (type === 'K') {
        const startingPosition = color === 'W' ? 'e1' : 'e8';
        piece.hasMoved = position !== startingPosition;
      } else if (type === 'R') {
        const startingPositions = color === 'W' ? ['a1', 'h1'] : ['a8', 'h8'];
        piece.hasMoved = !startingPositions.includes(position);
      }

      this.pieces.set(position, piece);
    }
  }
}
