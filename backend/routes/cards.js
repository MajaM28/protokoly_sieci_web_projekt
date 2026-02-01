const express = require("express");
const router = express.Router(); // express router -> mini aplikacja do grupowania endpointów
const { dbRun, dbGet, dbAll } = require("../database/db");

function generateBingoCard() {
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

      const [min, max] = ranges[col];
      let randomNum;

      do {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (singleCard.some((r) => r[col] === randomNum));

      rowNum.push(randomNum);
    }
    singleCard.push(rowNum);
  }
  return singleCard;
}
//post(create), read(get), put(update), delete(delete)
router.post("/", async (req, res) => {
  try {
    const { userId, gameId } = req.body;
    const newCard = {
      id: Date.now().toString(),
      userId,
      gameId,
      numbers: generateBingoCard(),
      markedPositions: [[2, 2]],
      createdAt: new Date(),
    };
    await dbRun(
      "INSERT INTO cards (id, userId, gameId, numbers, markedPositions, createdAt) VALUES (?, ?, ?, ?, ?,?)",
      [
        newCard.id,
        newCard.userId,
        newCard.gameId,
        JSON.stringify(newCard.numbers),
        JSON.stringify(newCard.markedPositions),
        newCard.createdAt,
      ],
    );
    return res.status(201).json(newCard);
  } catch (err) {
    console.error("Card error:", err);
    return res.status(500).json("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId, gameId } = req.query; //parametry z URL

    let query = "SELECT * FROM cards WHERE 1=1";
    const params = [];
    if (userId) {
      query += " AND userId = ?";
      params.push(userId);
    }

    if (gameId) {
      query += " AND gameId = ?";
      params.push(gameId);
    }
    const cards = await dbAll(query, params);
    const reworkCards = cards.map((c) => {
      return {
        ...c,
        numbers: JSON.parse(c.numbers),
        markedPositions: JSON.parse(c.markedPositions),
      };
    });
    return res.status(200).json(reworkCards);
  } catch (err) {
    console.error("Get cards error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id; // id nie przychodzi z posta (body) -> pochoddzi z params (dane z url)

    const found = await dbGet("SELECT * FROM cards WHERE id = ?", [id]);

    if (!found) {
      return res.status(404).json("No such card found");
    }

    const reworkfind = {
      ...found,
      numbers: JSON.parse(found.numbers),
      markedPositions: JSON.parse(found.markedPositions),
    };

    return res.status(200).json(reworkfind);
  } catch (err) {
    console.error("Get one card error:", err);
    return res.status(500).json("Server error");
  }
});

//ogólny update
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const exists = await dbGet("SELECT * FROM cards WHERE id = ?", [id]);
    if (!exists) {
      return res.status(404).json("No such card found");
    }
    const { markedPositions } = req.body;
    await dbRun("UPDATE cards SET markedPositions = ? WHERE id = ?", [
      markedPositions
        ? JSON.stringify(markedPositions)
        : exists.markedPositions,
      id,
    ]); //updatujemy dane , jak nie zosatły podane to są undefined wiec zosatja te co byly oryginalnie (w exists), nic to nie zwraca (bo to run)
    const updated = await dbGet("SELECT * FROM cards WHERE id = ?", [id]); // trzeba pobrac dane jeszcze raz zeby je zwrocic juz z nowymi wartosciami
    const reworkUpdate = {
      ...updated,
      numbers: JSON.parse(updated.numbers),
      markedPositions: JSON.parse(updated.markedPositions),
    };
    return res.status(200).json(reworkUpdate);
  } catch (err) {
    console.error("Update card error:", err);
    return res.status(500).json("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const exists = await dbGet("SELECT * FROM cards WHERE id = ?", [id]);
    if (!exists) {
      return res.status(404).json("No such card found");
    }

    await dbRun("DELETE FROM cards WHERE id = ?", [id]);
    return res.status(200).json("Card deleted");
  } catch (err) {
    console.error("Delete card error:", err);
    return res.status(500).json("Server error");
  }
});

module.exports = router;
