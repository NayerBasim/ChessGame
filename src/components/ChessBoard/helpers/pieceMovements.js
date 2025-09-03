
// fix pawn force takkes if piece possible
export function opponent(letter) {
  if (letter == "B") {
    return "W";
  } else if (letter == "W") {
    return "B";
  } else {
    return "invalid";
  }
};
export function nextLetter(letter) {
  return String.fromCharCode(letter.charCodeAt(0) + 1);
}
export function prevLetter(letter) {
  return String.fromCharCode(letter.charCodeAt(0) - 1);
}

export function checkOccupied(block, colour, positions) {
  if (block in positions) {
    if (block[0] == colour) {
      return true;
    }
    if (block[0] != colour) {
      return false;
    } else return false;
  }
}

//functions contrlling the movement of the pieces
//functions contrlling the movement of the pieces

export const whitePawnMoves = (positionx, positiony, possible, positions) => {
  let positionyTemp = positiony;
  let positionxTemp = positionx;

  if (!(positionx + (positiony + 1) in positions)) {
    positionyTemp = positiony + 1;
    possible.push(positionx + positionyTemp);
  }
  if (
    nextLetter(positionx) + (positiony + 1) in positions &&
    positions[nextLetter(positionx) + (positiony + 1)][0] == "B"
  ) {
    possible.push(nextLetter(positionx) + (positiony + 1));
  }
  if (
    prevLetter(positionx) + (positiony + 1) in positions &&
    positions[prevLetter(positionx) + (positiony + 1)][0] == "B"
  ) {
    possible.push(prevLetter(positionx) + (positiony + 1));
  }
  //   // enpassant
  //   if (positiony == 5 && canEnPassant) {
  //     if (
  //       nextLetter(positionx) + positiony in positions &&
  //       positions[nextLetter(positionx) + positiony].slice(0, 2) == "BP"
  //     ) {
  //       possible.push(nextLetter(positionx) + (positiony + 1));
  //       setEnPassant(nextLetter(positionx) + (positiony + 1));
  //     }
  //     if (
  //       prevLetter(positionx) + positiony in positions &&
  //       positions[nextLetter(positionx) + positiony].slice(0, 2) == "BP"
  //     ) {
  //       possible.push(prevLetter(positionx) + (positiony + 1));
  //       setEnPassant(prevLetter(positionx) + (positiony + 1));
  //     }
  //   }

  if (positiony == 2 && !(positionx + "4" in positions)) {
    possible.push(positionx + "4");
    // setCanEnPassant(true);
  }
  return possible;
};
export const blackPawnMoves = (positionx, positiony, possible, positions) => {
  let positionyTemp = positiony;
  let positionxTemp = positionx;
  if (!(positionx + (positiony - 1) in positions)) {
    positionyTemp = positiony - 1;
    possible.push(positionx + positionyTemp);
  }
  if (
    nextLetter(positionx) + (positiony - 1) in positions &&
    positions[nextLetter(positionx) + (positiony - 1)][0] == "W"
  ) {
    possible.push(nextLetter(positionx) + (positiony - 1));
  }
  if (
    prevLetter(positionx) + (positiony - 1) in positions &&
    positions[prevLetter(positionx) + (positiony - 1)][0] == "W"
  ) {
    possible.push(prevLetter(positionx) + (positiony - 1));
  }

  if (positiony == 7 && !(positionx + "5" in positions)) {
    possible.push(positionx + "5");
    // setCanEnPassant(true);
  }

  return possible;
};
export const rookMoves = (positionx, positiony, possible, positions) => {
  let count = 0;
  let positionyTemp = positiony;
  let positionxTemp = positionx;
  positionyTemp += 1;
  while (positionyTemp != 9 && !(positionx + positionyTemp in positions)) {
    possible.push(positionx + positionyTemp);
    positionyTemp += 1;
    count += 1;
  }
  if (
    positionxTemp + positionyTemp in positions &&
    positionx + positiony in positions &&
    positions[positionxTemp + positionyTemp][0] !=
      positions[positionx + positiony][0]
  ) {
    possible.push(positionxTemp + positionyTemp);
  }

  positionyTemp = positiony;
  count = 0;
  positionyTemp -= 1;
  while (positionyTemp != 0 && !(positionx + positionyTemp in positions)) {
    possible.push(positionx + positionyTemp);
    positionyTemp -= 1;
    count += 1;
  }
  if (
    positionxTemp + positionyTemp in positions &&
    positionx + positiony in positions &&
    positions[positionxTemp + positionyTemp][0] !=
      positions[positionx + positiony][0]
  ) {
    possible.push(positionxTemp + positionyTemp);
  }

  positionyTemp = positiony;
  count = 0;
  positionxTemp = nextLetter(positionxTemp);
  while (
    positionxTemp != nextLetter("h") &&
    !(positionxTemp + positiony in positions)
  ) {
    possible.push(positionxTemp + positiony);
    positionxTemp = nextLetter(positionxTemp);
    count += 1;
  }

  if (
    positionxTemp + positionyTemp in positions &&
    positionx + positiony in positions &&
    positions[positionxTemp + positionyTemp][0] !=
      positions[positionx + positiony][0]
  ) {
    possible.push(positionxTemp + positionyTemp);
  }

  positionxTemp = positionx;
  count = 0;
  positionxTemp = prevLetter(positionxTemp);
  while (
    positionxTemp != prevLetter("a") &&
    (!(positionxTemp + positiony in positions) || count == 0)
  ) {
    possible.push(positionxTemp + positiony);
    positionxTemp = prevLetter(positionxTemp);
    count += 1;
  }

  if (
    positionxTemp + positionyTemp in positions &&
    positionx + positiony in positions &&
    positions[positionxTemp + positionyTemp][0] !=
      positions[positionx + positiony][0]
  ) {
    possible.push(positionxTemp + positionyTemp);
  }

  return possible;
};

export const bishopMoves = (positionx, positiony, possible, positions) => {
  let count = 0;
  let positionyTemp = positiony;
  let positionxTemp = positionx;

  positionyTemp += 1;
  positionxTemp = nextLetter(positionxTemp);
  while (
    positionyTemp != 9 &&
    positionxTemp != nextLetter("h") &&
    !(positionxTemp + positionyTemp in positions)
  ) {
    possible.push(positionxTemp + positionyTemp);
    positionyTemp += 1;
    positionxTemp = nextLetter(positionxTemp);
    count += 1;
  }
  if (
    positionxTemp + positionyTemp in positions &&
    positionx + positiony in positions &&
    positions[positionxTemp + positionyTemp][0] !=
      positions[positionx + positiony][0]
  ) {
    possible.push(positionxTemp + positionyTemp);
  }
  positionyTemp = positiony;
  positionxTemp = positionx;
  count = 0;

  positionyTemp -= 1;
  positionxTemp = nextLetter(positionxTemp);
  while (
    positionyTemp != 0 &&
    positionxTemp != nextLetter("h") &&
    !(positionxTemp + positionyTemp in positions)
  ) {
    possible.push(positionxTemp + positionyTemp);
    positionyTemp -= 1;
    positionxTemp = nextLetter(positionxTemp);
    count += 1;
  }
  if (
    positionxTemp + positionyTemp in positions &&
    positionx + positiony in positions &&
    positions[positionxTemp + positionyTemp][0] !=
      positions[positionx + positiony][0]
  ) {
    possible.push(positionxTemp + positionyTemp);
  }
  positionyTemp = positiony;
  positionxTemp = positionx;
  count = 0;

  positionyTemp += 1;
  positionxTemp = prevLetter(positionxTemp);
  while (
    positionyTemp != 9 &&
    positionxTemp != prevLetter("a") &&
    !(positionxTemp + positionyTemp in positions)
  ) {
    possible.push(positionxTemp + positionyTemp);
    positionyTemp += 1;
    positionxTemp = prevLetter(positionxTemp);
    count += 1;
  }
  if (
    positionxTemp + positionyTemp in positions &&
    positionx + positiony in positions &&
    positions[positionxTemp + positionyTemp][0] !=
      positions[positionx + positiony][0]
  ) {
    possible.push(positionxTemp + positionyTemp);
  }
  positionyTemp = positiony;
  positionxTemp = positionx;
  count = 0;

  positionyTemp -= 1;
  positionxTemp = prevLetter(positionxTemp);
  while (
    positionyTemp != 0 &&
    positionxTemp != prevLetter("a") &&
    !(positionxTemp + positionyTemp in positions)
  ) {
    possible.push(positionxTemp + positionyTemp);
    positionyTemp -= 1;
    positionxTemp = prevLetter(positionxTemp);
    count += 1;
  }
  if (
    positionxTemp + positionyTemp in positions &&
    positionx + positiony in positions &&
    positions[positionxTemp + positionyTemp][0] !=
      positions[positionx + positiony][0]
  ) {
    possible.push(positionxTemp + positionyTemp);
  }
  return possible;
};

export const kingMoves = (positionx, positiony, possible, positions) => {
  let positionyTemp = positiony;
  let positionxTemp = positionx;
  if (nextLetter(positionxTemp) != "i") {
    possible.push(nextLetter(positionxTemp) + positionyTemp);
    if (positionyTemp != 8) {
      possible.push(nextLetter(positionxTemp) + (positionyTemp + 1));
    }
    if (positionyTemp != 1) {
      possible.push(nextLetter(positionxTemp) + (positionyTemp - 1));
    }
  }
  if (prevLetter(positionxTemp) != "`") {
    possible.push(prevLetter(positionxTemp) + positionyTemp);
    if (positionyTemp != 1) {
      possible.push(prevLetter(positionxTemp) + (positionyTemp - 1));
    }
    if (positionyTemp != 8) {
      possible.push(prevLetter(positionxTemp) + (positionyTemp + 1));
    }
  }
  if (positionyTemp != 8) {
    possible.push(positionxTemp + (positionyTemp + 1));
  }
  if (positionyTemp != 1) {
    possible.push(positionxTemp + (positionyTemp - 1));
  }

  for (let i = possible.length - 1; i >= 0; i--) {
    let element = possible[i];
    if (
      element in positions &&
      positionx + positiony in positions &&
      positions[element][0] === positions[positionx + positiony][0]
    ) {
      possible.splice(i, 1); // remove specific element by index
    }
  }
  return possible;
};

export const queenMoves = (positionx, positiony, possible, positions) => {
  let count = 0;
  let positionyTemp = positiony;
  let positionxTemp = positionx;
  while (
    positionyTemp != 8 &&
    (!(positionx + positionyTemp in positions) || count == 0)
  ) {
    positionyTemp += 1;
    possible.push(positionx + positionyTemp);
    count += 1;
  }
  positionyTemp = positiony;
  count = 0;
  while (
    positionyTemp != 1 &&
    (!(positionx + positionyTemp in positions) || count == 0)
  ) {
    positionyTemp -= 1;
    possible.push(positionx + positionyTemp);
    count += 1;
  }
  positionyTemp = positiony;
  count = 0;
  while (
    positionxTemp != "h" &&
    (!(positionxTemp + positiony in positions) || count == 0)
  ) {
    positionxTemp = nextLetter(positionxTemp);
    possible.push(positionxTemp + positiony);
    count += 1;
  }
  positionxTemp = positionx;
  count = 0;
  while (
    positionxTemp != "a" &&
    (!(positionxTemp + positiony in positions) || count == 0)
  ) {
    positionxTemp = prevLetter(positionxTemp);
    possible.push(positionxTemp + positiony);
    count += 1;
  }
  positionxTemp = positionx;
  count = 0;
  while (
    positionyTemp != 8 &&
    positionxTemp != "h" &&
    (!(positionxTemp + positionyTemp in positions) || count == 0)
  ) {
    positionyTemp += 1;
    positionxTemp = nextLetter(positionxTemp);
    possible.push(positionxTemp + positionyTemp);
    count += 1;
  }
  positionyTemp = positiony;
  positionxTemp = positionx;
  count = 0;

  while (
    positionyTemp != 1 &&
    positionxTemp != "h" &&
    (!(positionxTemp + positionyTemp in positions) || count == 0)
  ) {
    positionyTemp -= 1;
    positionxTemp = nextLetter(positionxTemp);
    possible.push(positionxTemp + positionyTemp);
    count += 1;
  }
  positionyTemp = positiony;
  positionxTemp = positionx;
  count = 0;
  while (
    positionyTemp != 8 &&
    positionxTemp != "a" &&
    (!(positionxTemp + positionyTemp in positions) || count == 0)
  ) {
    positionyTemp += 1;
    positionxTemp = prevLetter(positionxTemp);
    possible.push(positionxTemp + positionyTemp);
    count += 1;
  }
  positionyTemp = positiony;
  positionxTemp = positionx;
  count = 0;
  while (
    positionyTemp != 1 &&
    positionxTemp != "a" &&
    (!(positionxTemp + positionyTemp in positions) || count == 0)
  ) {
    positionyTemp -= 1;
    positionxTemp = prevLetter(positionxTemp);
    possible.push(positionxTemp + positionyTemp);
    count += 1;
  }

  for (let i = possible.length - 1; i >= 0; i--) {
    let element = possible[i];
    if (
      element in positions &&
      positionx + positiony in positions &&
      positions[element][0] === positions[positionx + positiony][0]
    ) {
      possible.splice(i, 1); // remove specific element by index
    }
  }
  return possible;
};

export const knightMoves = (positionx, positiony, possible, positions) => {
  let count = 0;
  let positionyTemp = positiony;
  let positionxTemp = positionx;
  let temp = [];
  temp.push([positionyTemp + 2, nextLetter(positionxTemp)]);
  temp.push([positionyTemp + 2, prevLetter(positionxTemp)]);
  temp.push([positionyTemp - 2, nextLetter(positionxTemp)]);
  temp.push([positionyTemp - 2, prevLetter(positionxTemp)]);
  temp.push([positionyTemp + 1, nextLetter(nextLetter(positionxTemp))]);
  temp.push([positionyTemp + 1, prevLetter(prevLetter(positionxTemp))]);
  temp.push([positionyTemp - 1, nextLetter(nextLetter(positionxTemp))]);
  temp.push([positionyTemp - 1, prevLetter(prevLetter(positionxTemp))]);
  temp.forEach((element) => {
    if (
      element[0] <= 8 &&
      element[0] >= 0 &&
      element[1].charCodeAt(0) >= "a".charCodeAt(0) &&
      element[1].charCodeAt(0) <= "h".charCodeAt(0)
    ) {
      if (
        !(element[0] + element[1] in positions) ||
        positions[element[1] + element[0]][0] !=
          positions[positionx + positiony][0]
      ) {
        possible.push(element[1] + element[0]);
      }
    }
  });
  for (let i = possible.length - 1; i >= 0; i--) {
    let element = possible[i];
    if (
      element in positions &&
      positionx + positiony in positions &&
      positions[element][0] === positions[positionx + positiony][0]
    ) {
      possible.splice(i, 1); // remove specific element by index
    }
  }
  return possible;
};


export function castleLeftW(positions, canCastleW) {
    if (
      canCastleW[0] &&
      !positions["b1"] &&
      !positions["c1"] &&
      !positions["d1"]
    ) {
      delete positions["e1"];
      delete positions["a1"];
      positions["c1"] = "WK";
      positions["d1"] = "WR1";
    }
}
export function castleRightW(positions, canCastleW) {
    if (canCastleW[1] && !positions["f1"] && !positions["g1"]) {
      delete positions["e1"];
      delete positions["h1"];
      positions["g1"] = "WK";
      positions["f1"] = "WR1";
    }
}
export function castleLeftB(positions, canCastleB) {
    if (
      canCastleB[0] &&
      !positions["b8"] &&
      !positions["c8"] &&
      !positions["d8"]
    ) {
      delete positions["e8"];
      delete positions["a8"];
      positions["c8"] = "BK";
      positions["d8"] = "BR1";
    }
}
export function castleRightB(positions, canCastleB) {
    if (canCastleB[1] && !positions["f8"] && !positions["g8"]) {
      delete positions["e8"];
      delete positions["h8"];
      positions["g8"] = "BK";
      positions["f8"] = "BR1";
    }
}