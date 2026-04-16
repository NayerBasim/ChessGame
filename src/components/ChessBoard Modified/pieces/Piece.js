/**
 * Base class for all chess pieces
 */
export class Piece {
  constructor(color, type, id, position) {
    this.color = color; // 'W' or 'B'
    this.type = type; // 'P', 'R', 'N', 'B', 'Q', 'K'
    this.id = id; // e.g., 'WP1', 'BR2'
    this.position = position; // e.g., 'e4'
    this.hasMoved = false;
  }

  /**
   * Get possible moves for this piece
   * To be implemented by each piece subclass
   * @param {Board} board - The current board state
   * @returns {Array<string>} Array of possible move positions
   */
  getPossibleMoves(board) {
    throw new Error('getPossibleMoves must be implemented by subclass');
  }

  /**
   * Check if a move is valid (within board bounds and follows piece rules)
   * @param {string} targetPosition - Position to move to
   * @param {Board} board - Current board state
   * @returns {boolean}
   */
  isValidMove(targetPosition, board) {
    const possibleMoves = this.getPossibleMoves(board);
    return possibleMoves.includes(targetPosition);
  }

  /**
   * Move the piece to a new position
   * @param {string} newPosition - New position
   */
  moveTo(newPosition) {
    this.position = newPosition;
    this.hasMoved = true;
  }

  /**
   * Get the opposite color
   * @param {string} color - 'W' or 'B'
   * @returns {string} Opposite color
   */
  static getOpponentColor(color) {
    return color === 'W' ? 'B' : 'W';
  }

  /**
   * Convert letter to next letter (a->b, b->c, etc.)
   * @param {string} letter - Single letter
   * @returns {string} Next letter
   */
  static nextLetter(letter) {
    return String.fromCharCode(letter.charCodeAt(0) + 1);
  }

  /**
   * Convert letter to previous letter (b->a, c->b, etc.)
   * @param {string} letter - Single letter
   * @returns {string} Previous letter
   */
  static prevLetter(letter) {
    return String.fromCharCode(letter.charCodeAt(0) - 1);
  }

  /**
   * Check if position is within board bounds
   * @param {string} position - Position like 'e4'
   * @returns {boolean}
   */
  static isValidPosition(position) {
    if (position.length !== 2) return false;
    const file = position[0];
    const rank = parseInt(position[1]);
    return file >= 'a' && file <= 'h' && rank >= 1 && rank <= 8;
  }

  /**
   * Check if a square is occupied by opponent's piece
   * @param {string} position - Position to check
   * @param {Board} board - Current board state
   * @returns {boolean}
   */
  isOpponentPiece(position, board) {
    const piece = board.getPieceAt(position);
    return piece && piece.color !== this.color;
  }

  /**
   * Check if a square is occupied by own piece
   * @param {string} position - Position to check
   * @param {Board} board - Current board state
   * @returns {boolean}
   */
  isOwnPiece(position, board) {
    const piece = board.getPieceAt(position);
    return piece && piece.color === this.color;
  }

  /**
   * Check if a square is empty
   * @param {string} position - Position to check
   * @param {Board} board - Current board state
   * @returns {boolean}
   */
  isEmpty(position, board) {
    return !board.getPieceAt(position);
  }
}
