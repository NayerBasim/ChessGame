export const pieceImageFromID = (id) => {
  const map = {
    WK: require('../../../media/king-w.svg').default,
    WQ: require('../../../media/queen-w.svg').default,
    WR: require('../../../media/rook-w.svg').default,
    WB: require('../../../media/bishop-w.svg').default,
    WN: require('../../../media/knight-w.svg').default,
    WP: require('../../../media/pawn-w.svg').default,

    BK: require('../../../media/king-b.svg').default,
    BQ: require('../../../media/queen-b.svg').default,
    BR: require('../../../media/rook-b.svg').default,
    BB: require('../../../media/bishop-b.svg').default,
    BN: require('../../../media/knight-b.svg').default,
    BP: require('../../../media/pawn-b.svg').default,
  };

  // Take just the piece type (e.g. "WP" from "WP1", "WR2")
  const prefix = id.slice(0, 2);

  return map[prefix] || ""; // fallback to empty string if not found
}