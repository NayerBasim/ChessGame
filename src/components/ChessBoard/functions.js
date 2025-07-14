// functions to treat letters as numbers

// fix pawn force takkes if piece possible
export const opponent = (letter) => {
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

export const whitePawnMoves = (positionx, positiony, possible, positions) => {
  let positionyTemp = positiony;
  let positionxTemp = positionx;
  let enpassant = "";
  if (!(positionx + (positiony + 1) in positions)) {
    positionyTemp = positiony + 1;
    possible.push(positionx + positionyTemp);
  }
  if (nextLetter(positionx) + (positiony + 1) in positions) {
    possible.push(nextLetter(positionx) + (positiony + 1));
  }
  if (prevLetter(positionx) + (positiony + 1) in positions) {
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

  if (positionyTemp == 3 && !(positionx + "3" in positions)) {
    positionyTemp = positionyTemp + 1;
    possible.push(positionx + positionyTemp);
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
  if (nextLetter(positionx) + (positiony - 1) in positions) {
    possible.push(nextLetter(positionx) + (positiony - 1));
  }
  if (prevLetter(positionx) + (positiony - 1) in positions) {
    possible.push(prevLetter(positionx) + (positiony - 1));
  }

  if (positionyTemp == 6 && !(positionx + "6" in positions)) {
    positionyTemp = positionyTemp - 1;
    possible.push(positionx + positionyTemp);
    // setCanEnPassant(true);
  }

  return possible;
};
export const rookMoves = (positionx, positiony, possible, positions) => {
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
  return possible;
};

export const bishopMoves = (positionx, positiony, possible, positions) => {
  let count = 0;
  let positionyTemp = positiony;
  let positionxTemp = positionx;
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
    if (element[0] <= 8 && element[0] >= 0) {
      if (
        element[1].charCodeAt(0) >= "a".charCodeAt(0) &&
        element[1].charCodeAt(0) <= "h".charCodeAt(0)
      ) {
        possible.push(element[1] + element[0]);
      }
    }
  });

  return possible;
};
