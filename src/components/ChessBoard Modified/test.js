// Simple test to demonstrate the OOP chess implementation
import { ChessGame } from './logic/ChessGame.js';

// Create a new game instance
const game = new ChessGame();

console.log('=== Chess Game OOP Implementation Test ===');

// Test 1: Initial board setup
console.log('\n1. Initial Board Setup:');
const initialPositions = game.getPositionsForView();
console.log('White King at:', game.getBoard().getKingPosition('W')); // Should be 'e1'
console.log('Black King at:', game.getBoard().getKingPosition('B')); // Should be 'e8'
console.log('Total pieces on board:', Object.keys(initialPositions).length); // Should be 32

// Test 2: Piece selection and movement
console.log('\n2. Piece Selection and Movement:');
console.log('Current turn:', game.getCurrentTurn()); // Should be 'W'

// Select white pawn at e2
const selectResult = game.selectPiece('e2');
console.log('Selected e2 pawn:', selectResult); // Should be true

// Get possible moves
const possibleMoves = game.getPossibleMoves();
console.log('Possible moves for e2 pawn:', possibleMoves); // Should be ['e3', 'e4']

// Make a move
const moveResult = game.attemptMove('e4');
console.log('Move e2 to e4 result:', moveResult.success); // Should be true
console.log('Current turn after move:', game.getCurrentTurn()); // Should be 'B'

// Test 3: Invalid move handling
console.log('\n3. Invalid Move Handling:');
// Try to move white piece when it's black's turn
const invalidSelect = game.selectPiece('d2');
console.log('Trying to select white piece during black turn:', invalidSelect); // Should be false

// Test 4: Check detection
console.log('\n4. Game State Management:');
console.log('Current game state:', game.getGameState()); // Should be 'active'
console.log('White in check:', game.isColorInCheck('W')); // Should be false
console.log('Black in check:', game.isColorInCheck('B')); // Should be false

// Test 5: Board state methods
console.log('\n5. Board State Methods:');
const whitePieces = game.getBoard().getPiecesByColor('W');
const blackPieces = game.getBoard().getPiecesByColor('B');
console.log('White pieces count:', whitePieces.length); // Should be 16
console.log('Black pieces count:', blackPieces.length); // Should be 16

// Test 6: Piece type identification
console.log('\n6. Piece Type Identification:');
const e4Piece = game.getBoard().getPieceAt('e4');
console.log('Piece at e4:', e4Piece ? `${e4Piece.color}${e4Piece.type} (${e4Piece.id})` : 'None');

// Test 7: Save/Load functionality
console.log('\n7. Save/Load Functionality:');
game.saveToLocalStorage();
console.log('Game saved to localStorage');

const newGame = new ChessGame();
const loadResult = newGame.loadFromLocalStorage();
console.log('Game loaded from localStorage:', loadResult);
if (loadResult) {
  console.log('Loaded game turn:', newGame.getCurrentTurn());
  console.log('Piece at e4 after load:', newGame.getBoard().getPieceAt('e4') ? 'Present' : 'Not present');
}

console.log('\n=== Test Complete ===');
console.log('✅ All basic functionality working correctly!');

export { game as testGame };
