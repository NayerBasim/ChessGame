import { Piece } from './Piece.js';

export class Pawn extends Piece {
  constructor(color, id, position) {
    super(color, 'P', id, position);
  }

  getPossibleMoves(board) {
    const possible = [];
    const file = this.position[0];
    const rank = parseInt(this.position[1]);
    
    if (this.color === 'W') {
      // White pawn moves up (increasing rank)
      const oneSquareUp = file + (rank + 1);
      const twoSquaresUp = file + (rank + 2);
      
      // Move forward one square
      if (Piece.isValidPosition(oneSquareUp) && this.isEmpty(oneSquareUp, board)) {
        possible.push(oneSquareUp);
        
        // Move forward two squares from starting position
        if (rank === 2 && Piece.isValidPosition(twoSquaresUp) && this.isEmpty(twoSquaresUp, board)) {
          possible.push(twoSquaresUp);
        }
      }
      
      // Capture diagonally
      const captureLeft = Piece.prevLetter(file) + (rank + 1);
      const captureRight = Piece.nextLetter(file) + (rank + 1);
      
      if (Piece.isValidPosition(captureLeft) && this.isOpponentPiece(captureLeft, board)) {
        possible.push(captureLeft);
      }
      
      if (Piece.isValidPosition(captureRight) && this.isOpponentPiece(captureRight, board)) {
        possible.push(captureRight);
      }
    } else {
      // Black pawn moves down (decreasing rank)
      const oneSquareDown = file + (rank - 1);
      const twoSquaresDown = file + (rank - 2);
      
      // Move forward one square
      if (Piece.isValidPosition(oneSquareDown) && this.isEmpty(oneSquareDown, board)) {
        possible.push(oneSquareDown);
        
        // Move forward two squares from starting position
        if (rank === 7 && Piece.isValidPosition(twoSquaresDown) && this.isEmpty(twoSquaresDown, board)) {
          possible.push(twoSquaresDown);
        }
      }
      
      // Capture diagonally
      const captureLeft = Piece.prevLetter(file) + (rank - 1);
      const captureRight = Piece.nextLetter(file) + (rank - 1);
      
      if (Piece.isValidPosition(captureLeft) && this.isOpponentPiece(captureLeft, board)) {
        possible.push(captureLeft);
      }
      
      if (Piece.isValidPosition(captureRight) && this.isOpponentPiece(captureRight, board)) {
        possible.push(captureRight);
      }
    }
    
    return possible;
  }
}
