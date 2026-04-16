import { Piece } from './Piece.js';

export class King extends Piece {
  constructor(color, id, position) {
    super(color, 'K', id, position);
  }

  getPossibleMoves(board) {
    const possible = [];
    const file = this.position[0];
    const rank = parseInt(this.position[1]);
    
    // All possible king moves (one square in any direction)
    const kingMoves = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    kingMoves.forEach(([fileOffset, rankOffset]) => {
      const newFile = String.fromCharCode(file.charCodeAt(0) + fileOffset);
      const newRank = rank + rankOffset;
      const newPos = newFile + newRank;
      
      if (Piece.isValidPosition(newPos)) {
        if (this.isEmpty(newPos, board) || this.isOpponentPiece(newPos, board)) {
          possible.push(newPos);
        }
      }
    });
    
    return possible;
  }

  /**
   * Get castling moves for the king
   * @param {Board} board - Current board state
   * @param {Object} castlingRights - Castling rights for this color
   * @returns {Array<string>} Array of castling positions
   */
  getCastlingMoves(board, castlingRights) {
    const possible = [];
    
    if (this.hasMoved) {
      return possible; // Can't castle if king has moved
    }
    
    const rank = this.color === 'W' ? '1' : '8';
    
    // Kingside castling
    if (castlingRights.kingside) {
      const f1 = 'f' + rank;
      const g1 = 'g' + rank;
      
      if (this.isEmpty(f1, board) && this.isEmpty(g1, board)) {
        // Check if rook is in place and hasn't moved
        const rook = board.getPieceAt('h' + rank);
        if (rook && rook.type === 'R' && rook.color === this.color && !rook.hasMoved) {
          possible.push(g1);
        }
      }
    }
    
    // Queenside castling
    if (castlingRights.queenside) {
      const b1 = 'b' + rank;
      const c1 = 'c' + rank;
      const d1 = 'd' + rank;
      
      if (this.isEmpty(b1, board) && this.isEmpty(c1, board) && this.isEmpty(d1, board)) {
        // Check if rook is in place and hasn't moved
        const rook = board.getPieceAt('a' + rank);
        if (rook && rook.type === 'R' && rook.color === this.color && !rook.hasMoved) {
          possible.push(c1);
        }
      }
    }
    
    return possible;
  }
}
