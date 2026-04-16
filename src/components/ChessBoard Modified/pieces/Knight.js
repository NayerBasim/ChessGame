import { Piece } from './Piece.js';

export class Knight extends Piece {
  constructor(color, id, position) {
    super(color, 'N', id, position);
  }

  getPossibleMoves(board) {
    const possible = [];
    const file = this.position[0];
    const rank = parseInt(this.position[1]);
    
    // All possible knight moves (L-shaped)
    const knightMoves = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
    
    knightMoves.forEach(([fileOffset, rankOffset]) => {
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
}
