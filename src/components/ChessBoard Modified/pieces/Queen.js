import { Piece } from './Piece.js';
import { Rook } from './Rook.js';
import { Bishop } from './Bishop.js';

export class Queen extends Piece {
  constructor(color, id, position) {
    super(color, 'Q', id, position);
  }

  getPossibleMoves(board) {
    // Queen moves like a combination of rook and bishop
    const possible = [];
    
    // Create temporary rook and bishop to get their moves
    const tempRook = new Rook(this.color, 'temp', this.position);
    const tempBishop = new Bishop(this.color, 'temp', this.position);
    
    const rookMoves = tempRook.getPossibleMoves(board);
    const bishopMoves = tempBishop.getPossibleMoves(board);
    
    return [...rookMoves, ...bishopMoves];
  }
}
