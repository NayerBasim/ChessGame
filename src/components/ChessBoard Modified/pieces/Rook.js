import { Piece } from './Piece.js';

export class Rook extends Piece {
  constructor(color, id, position) {
    super(color, 'R', id, position);
  }

  getPossibleMoves(board) {
    const possible = [];
    const file = this.position[0];
    const rank = parseInt(this.position[1]);
    
    // Move up (increasing rank)
    for (let r = rank + 1; r <= 8; r++) {
      const pos = file + r;
      if (this.isEmpty(pos, board)) {
        possible.push(pos);
      } else if (this.isOpponentPiece(pos, board)) {
        possible.push(pos);
        break; // Can't move past opponent piece
      } else {
        break; // Can't move past own piece
      }
    }
    
    // Move down (decreasing rank)
    for (let r = rank - 1; r >= 1; r--) {
      const pos = file + r;
      if (this.isEmpty(pos, board)) {
        possible.push(pos);
      } else if (this.isOpponentPiece(pos, board)) {
        possible.push(pos);
        break;
      } else {
        break;
      }
    }
    
    // Move right (increasing file)
    for (let f = Piece.nextLetter(file); f <= 'h'; f = Piece.nextLetter(f)) {
      const pos = f + rank;
      if (this.isEmpty(pos, board)) {
        possible.push(pos);
      } else if (this.isOpponentPiece(pos, board)) {
        possible.push(pos);
        break;
      } else {
        break;
      }
    }
    
    // Move left (decreasing file)
    for (let f = Piece.prevLetter(file); f >= 'a'; f = Piece.prevLetter(f)) {
      const pos = f + rank;
      if (this.isEmpty(pos, board)) {
        possible.push(pos);
      } else if (this.isOpponentPiece(pos, board)) {
        possible.push(pos);
        break;
      } else {
        break;
      }
    }
    
    return possible;
  }
}
