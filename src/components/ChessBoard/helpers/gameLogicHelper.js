

export function pieceImageFromID(id){
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


// Castling methods refactored to take arguments and update state
export const castleLeftW = (canCastleW, positions, setPositions) => {
    if (
      canCastleW[0] &&
      !positions["b1"] &&
      !positions["c1"] &&
      !positions["d1"]
    ) {
      setPositions(prev => {
        const newPositions = { ...prev };
        delete newPositions["e1"];
        delete newPositions["a1"];
        newPositions["c1"] = "WK";
        newPositions["d1"] = "WR1";
        return newPositions;
      });
    }
  };

export const castleRightW = (canCastleW, positions, setPositions) => {
    if (canCastleW[1] && !positions["f1"] && !positions["g1"]) {
      setPositions(prev => {
        const newPositions = { ...prev };
        delete newPositions["e1"];
        delete newPositions["h1"];
        newPositions["g1"] = "WK";
        newPositions["f1"] = "WR1";
        return newPositions;
      });
    }
  };

export const castleLeftB = (canCastleB, positions, setPositions) => {
    if (
      canCastleB[0] &&
      !positions["b8"] &&
      !positions["c8"] &&
      !positions["d8"]
    ) {
      setPositions(prev => {
        const newPositions = { ...prev };
        delete newPositions["e8"];
        delete newPositions["a8"];
        newPositions["c8"] = "BK";
        newPositions["d8"] = "BR1";
        return newPositions;
      });
    }
  };

export const castleRightB = (canCastleB, positions, setPositions) => {
    if (canCastleB[1] && !positions["f8"] && !positions["g8"]) {
      setPositions(prev => {
        const newPositions = { ...prev };
        delete newPositions["e8"];
        delete newPositions["h8"];
        newPositions["g8"] = "BK";
        newPositions["f8"] = "BR1";
        return newPositions;
      });
    }
  };