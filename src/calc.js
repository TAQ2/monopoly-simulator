const tiles = [
  "GO",
  "OLD KENT ROAD",
  "COMMUNITY CHEST",
  "WHITECHAPEL ROAD",
  "INCOME TAX",
  "KINGS CROSS STATION",
  "THE ANGEL ISLINGTON",
  "CHANCE",
  "EUSTON ROAD",
  "PENTONVILLE ROAD",
  "JAIL",
  "PALL MALL",
  "ELECTRIC COMPANY",
  "WHITEHALL",
  "NORTHUMBERLAND AVENUE",
  "MARYLEBONE STATION",
  "BOW STREET",
  "COMMUNITY CHEST",
  "MARLBOROUGH STREET",
  "VINE STREET",
  "FREE PARKING",
  "THE STRAND",
  "CHANCE",
  "FLEET STREET",
  "TRAFALGAR SQUARE",
  "FENCHURCH STREET STATION",
  "LEICESTER SQUARE",
  "COVENTRY STREET",
  "WATER WORKS",
  "PICCADILLY",
  "GO TO JAIL",
  "REGENT STREET",
  "OXFORD STREET",
  "COMMUNITY CHEST",
  "BOND STREET",
  "LIVERPOOL STREET STATION",
  "PARK LANE",
  "LUXURY TAX",
  "MAYFAIR"
];

let communityChestCards = [
  "GO",
  "OLD KENT ROAD",
  "JAIL",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];
let chanceCards = [
  "GO",
  "JAIL",
  "PALL MALL",
  "MARYLEBONE STATION",
  "TRAFALGAR SQUARE",
  "MAYFAIR",
  "GO BACK THREE",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];

// @Incomplete - keep histories together so we know the order
const diceRollHistory = [];
// @Incomplete - doesn't record all tiles landed on, only ones that you end the turn on
const playerTileHistory = [];
const cardHistory = [];
let communityChestCardIndex = 0;
let chanceCardIndex = 0;

// @Incomplete - test
function shuffle(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = temp;
  }

  return newArray;
}

// @Incomplete - test?
function rollDice() {
  const diceSides = 6;

  const roll1 = Math.floor(Math.random() * diceSides) + 1;
  const roll2 = Math.floor(Math.random() * diceSides) + 1;

  return [roll1, roll2];
}

// @Incomplete - test
function indexOfTile(tile) {
  return tiles.indexOf(tile);
}

// @Cleanup - this function shouldn't know what community chest or chance are
function takeCard(cardType, playerCurrentTileIndex) {
  let newPlayerCurrentTileIndex = playerCurrentTileIndex;
  switch (cardType) {
    case null:
      break;
    case "GO BACK THREE":
      newPlayerCurrentTileIndex = goBackThree(
        newPlayerCurrentTileIndex,
        tiles.length
      );
      break;
    default:
      newPlayerCurrentTileIndex = indexOfTile(cardType);
  }

  return newPlayerCurrentTileIndex;
}

export function goBackThree(playerCurrentTileIndex, tileCount) {
  return playerCurrentTileIndex - 3 < 0
    ? tileCount + playerCurrentTileIndex - 3
    : playerCurrentTileIndex - 3;
}

// @Incomplete - test
function takeTurn() {
  const diceRolls = rollDice();
  diceRollHistory.push(diceRolls);
  const diceTotal = diceRolls.reduce((a, b) => a + b, 0); // sum all the rolls

  let playerCurrentTileIndex =
    playerTileHistory.length === 0
      ? diceTotal
      : (playerTileHistory[playerTileHistory.length - 1] + diceTotal) %
        tiles.length;

  if (
    diceRollHistory.length > 2 &&
    // @Incomplete - send to jail doesn't work because it needs three lots of doubles
    [
      diceRollHistory[diceRollHistory.length - 1][0] ===
        diceRollHistory[diceRollHistory.length - 1][1],
      diceRollHistory[diceRollHistory.length - 2][0] ===
        diceRollHistory[diceRollHistory.length - 2][1],
      diceRollHistory[diceRollHistory.length - 3][0] ===
        diceRollHistory[diceRollHistory.length - 3][1]
    ].every(roll => roll)
  ) {
    playerCurrentTileIndex = takeCard("JAIL", playerCurrentTileIndex);
  } else if (tiles[playerCurrentTileIndex] === "GO TO JAIL") {
    playerCurrentTileIndex = takeCard("JAIL", playerCurrentTileIndex);
  } else {
    if (tiles[playerCurrentTileIndex] === "COMMUNITY CHEST") {
      playerCurrentTileIndex = takeCard(
        communityChestCards[communityChestCardIndex],
        playerCurrentTileIndex
      );
      communityChestCardIndex =
        (communityChestCardIndex + 1) % communityChestCards.length;

      cardHistory.push({
        type: "COMMUNITY CHEST",
        value: communityChestCards[communityChestCardIndex]
      });
    } else if (tiles[playerCurrentTileIndex] === "CHANCE") {
      playerCurrentTileIndex = takeCard(
        chanceCards[chanceCardIndex],
        playerCurrentTileIndex
      );

      chanceCardIndex = (chanceCardIndex + 1) % chanceCards.length;

      cardHistory.push({
        type: "CHANCE",
        value: chanceCards[chanceCardIndex]
      });
    }
  }

  playerTileHistory.push(playerCurrentTileIndex);
}

function simulateGame(turns) {
  communityChestCards = shuffle(communityChestCards);
  chanceCards = shuffle(chanceCards);

  for (let i = 0; i < turns; i++) {
    takeTurn();
  }

  var c = calculateTileStepCount().map(function(e, i) {
    return [e, tiles[i]];
  });

  return c;
}

// @Incomplete - test
function calculateTileStepCount() {
  const tileStepCount = new Array(tiles.length).fill(0);

  for (let i = 0; i < playerTileHistory.length; i++) {
    tileStepCount[playerTileHistory[i]] += 1;
  }

  return tileStepCount;
}

export default simulateGame;
