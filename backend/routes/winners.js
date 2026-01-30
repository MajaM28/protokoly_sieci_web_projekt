const express = require("express");
const router = express.Router();
const winners = [];

//post(create), read(get), put(update), delete(delete)

// POST - CREATE result
router.post("/", (req, res) => {
  const { gameId, winnerId, winnerName, winnerPattern, roundNumber } = req.body;

  const newWin = {
    id: Date.now().toString(),
    gameId,
    winnerId,
    winnerName,
    winnerPattern,
    roundNumber,
    wonAt: Date.now(),
  };

  winners.push(newWin);
  return res.status(201).json(newWin);
});

// GET all - READ all results (z filtrowaniem!)
router.get("/", (req, res) => {
  const { gameId, winnerId, roundNumber } = req.query;

  let filtered = winners;

  if (gameId) {
    filtered = filtered.filter((w) => {
      return w.gameId === gameId;
    });
  }

  if (winnerId) {
    filtered = filtered.filter((w) => {
      return w.winnerId === winnerId;
    });
  }

  if (roundNumber) {
    filtered = filtered.filter((w) => {
      return w.roundNumber === parseInt(roundNumber);
    });
  }

  return res.status(200).json(filtered);
});

// GET :id - READ one result
router.get("/:id", (req, res) => {
  const id = req.params.id;

  const found = winners.find((w) => {
    return w.id === id;
  });

  if (!found) {
    return res.status(404).json("No such winner found");
  } else {
    return res.status(200).json(found);
  }
});

// PUT :id - UPDATE result
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const winnerIndex = winners.findIndex((w) => w.id === id);
  if (winnerIndex === -1) {
    return res.status(404).json("No such winner found");
  } else {
    winners[winnerIndex] = {
      ...winners[winnerIndex],
      ...req.body,
    };
    return res.status(200).json(winners[winnerIndex]);
  }
});

// DELETE :id - DELETE result
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const winnerIndex = winners.findIndex((w) => w.id === id);
  if (winnerIndex === -1) {
    return res.status(404).json("No such winner found");
  } else {
    winners.splice(winnerIndex, 1); // modyfikuje a nie usuwam
    return res.status(200).json("winner deleted");
  }
});

module.exports = router;
