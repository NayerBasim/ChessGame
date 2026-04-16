import { Piece } from './Piece.js';

export class Bishop extends Piece {
  constructor(color, id, position) {
    super(color, 'B', id, position);
  }

  getPossibleMoves(board) {
    const possible = [];
    const file = this.position[0];
    const rank = parseInt(this.position[1]);
    
    // Up-right diagonal
    let f = Piece.nextLetter(file);
    let r = rank + 1;
    while (f <= 'h' && r <= 8) {
      const pos = f + r;
      if (this.isEmpty(pos, board)) {
        possible.push(pos);
      } else if (this.isOpponentPiece(pos, board)) {
        possible.push(pos);
        break;
      } else {
        break;
      }
      f = Piece.nextLetter(f);
      r++;
    }
    
    // Up-left diagonal
    f = Piece.prevLetter(file);
    r = rank + 1;
    while (f >= 'a' && r <= 8) {
      const pos = f + r;
      if (this.isEmpty(pos, board)) {
        possible.push(pos);
      } else if (this.isOpponentPiece(pos, board)) {
        possible.push(pos);
        break;
      } else {
        break;
      }
      f = Piece.prevLetter(f);
      r++;
    }
    
    // Down-right diagonal
    f = Piece.nextLetter(file);
    r = rank - 1;
    while (f <= 'h' && r >= 1) {
      const pos = f + r;
      if (this.isEmpty(pos, board)) {
        possible.push(pos);
      } else if (this.isOpponentPiece(pos, board)) {
        possible.push(pos);
        break;
      } else {
        break;
      }
      f = Piece.nextLetter(f);
      r--;
    }
    
    // Down-left diagonal
    f = Piece.prevLetter(file);
    r = rank - 1;
    while (f >= 'a' && r >= 1) {
      const pos = f + r;
      if (this.isEmpty(pos, board)) {
        possible.push(pos);
      } else if (this.isOpponentPiece(pos, board)) {
        possible.push(pos);
        break;
      } else {
        break;
      }
      f = Piece.prevLetter(f);
      r--;
    }
    
    return possible;
  }
}
