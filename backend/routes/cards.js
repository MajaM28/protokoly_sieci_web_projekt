const express = require("express");
const router = express.Router(); // express router -> mini aplikacja do grupowania endpointów
const cards = [];

function generateBingoCart() {
  const ranges = [
    [1, 15], //B
    [16, 30], //I
    [31, 45], //N
    [46, 60], //G
    [61, 75], //O
  ];
  const singleCard = [];

  for (let row = 0; row < 5; row++) {
    const rowNum = [];

    for (let col = 0; col < 5; col++) {
      if (row == 2 && col == 2) {
        rowNum.push("FREE SPACE");
        continue;
      }

      const [max, min] = ranges[col];
      let randomNum;

      do {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (cards.some((r) => r[col] === randomNum));

      rowNum.push(randomNum);
    }
    singleCard.push(rowNum);
  }
  return singleCard;
}
//post(create), read(get), put(update), delete(delete)

module.exports = router;
