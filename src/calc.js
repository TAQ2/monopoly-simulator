const tiles = [
  { label: "GO", category: "" },
  { label: "OLD KENT ROAD", category: "BROWN" },
  { label: "COMMUNITY CHEST", category: "CARD" },
  { label: "WHITECHAPEL ROAD", category: "BROWN" },
  { label: "INCOME TAX", category: "TAX" },
  { label: "KINGS CROSS STATION", category: "STATION" },
  { label: "THE ANGEL ISLINGTON", category: "BLUE" },
  { label: "CHANCE", category: "BLUE" },
  { label: "EUSTON ROAD", category: "BLUE" },
  { label: "PENTONVILLE ROAD", category: "BLUE" },
  { label: "JAIL", category: "" },
  { label: "PALL MALL", category: "PINK" },
  { label: "ELECTRIC COMPANY", category: "UTILITY" },
  { label: "WHITEHALL", category: "PINK" },
  { label: "NORTHUMBERLAND AVENUE", category: "PINK" },
  { label: "MARYLEBONE STATION", category: "STATION" },
  { label: "BOW STREET", category: "ORANGE" },
  { label: "COMMUNITY CHEST", category: "CARD" },
  { label: "MARLBOROUGH STREET", category: "ORANGE" },
  { label: "VINE STREET", category: "ORANGE" },
  { label: "FREE PARKING", category: "" },
  { label: "THE STRAND", category: "RED" },
  { label: "CHANCE", category: "CARD" },
  { label: "FLEET STREET", category: "RED" },
  { label: "TRAFALGAR SQUARE", category: "RED" },
  { label: "FENCHURCH STREET STATION", category: "STATION" },
  { label: "LEICESTER SQUARE", category: "YELLOW" },
  { label: "COVENTRY STREET", category: "YELLOW" },
  { label: "WATER WORKS", category: "UTILITY" },
  { label: "PICCADILLY", category: "YELLOW" },
  { label: "GO TO JAIL", category: "" },
  { label: "REGENT STREET", category: "GREEN" },
  { label: "OXFORD STREET", category: "GREEN" },
  { label: "COMMUNITY CHEST", category: "CARD" },
  { label: "BOND STREET", category: "GREEN" },
  { label: "LIVERPOOL STREET STATION", category: "STATION" },
  { label: "PARK LANE", category: "PURPLE" },
  { label: "LUXURY TAX", category: "BLUE" },
  { label: "MAYFAIR", category: "BLUE" }
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
function indexOfTile(targetTile) {
  return tiles.map(tile => tile.label).indexOf(targetTile);
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
  } else if (tiles[playerCurrentTileIndex].label === "GO TO JAIL") {
    playerCurrentTileIndex = takeCard("JAIL", playerCurrentTileIndex);
  } else {
    if (tiles[playerCurrentTileIndex].label === "COMMUNITY CHEST") {
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
    } else if (tiles[playerCurrentTileIndex].label === "CHANCE") {
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

  const tileStepCount = calculateTileStepCount().map((e, i) => [e, tiles[i]]);
  const categoryStepCount = tileStepCount.reduce((sum, num) => {
    if (sum[num.category] == null) {
      sum[num.category] = 0;
    }

    sum[num.category]++;
  }, {});

  return { tileStepCount, categoryStepCount };
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
