const express = require("express");
const router = express.Router();
const games = [];

//post(create), read(get), put(update), delete(delete)

router.post("/", (req, res) => {
  const { name, hostId, maxPlayers } = req.body;
  const newGame = {
    id: Date.now().toString(),
    name,
    hostId,
    maxPlayers: maxPlayers || 10,
    players: [],
    status: "waiting",
    drawnNumbers: [],
    createdAt: Date.now(),
  };

  games.push(newGame);
  return res.status(201).json(newGame);
});

router.get("/", (req, res) => {
  res.json(games);
});

router.get("/search/:pattern", (req, res) => {
  const pattern = req.params.pattern.toLowerCase();

  const matchedGames = games.filter((g) => {
    return g.name.toLowerCase().includes(pattern);
  });

  return res.json(matchedGames);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const found = games.find((g) => {
    return g.id === id;
  });
  if (!found) {
    return res.status(404).json("No such game found");
  } else {
    return res.status(200).json(found); // 200 dla get -> 201 dla post
  }
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const gameIndex = games.findIndex((g) => {
    return g.id === id;
  });
  if (gameIndex === -1) {
    return res.status(404).json("No such game found");
  } else {
    games[gameIndex] = {
      ...games[gameIndex],
      ...req.body,
    };
    return res.status(200).json(games[gameIndex]);
  }
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const gameIndex = games.findIndex((g) => {
    return g.id === id;
  });
  if (gameIndex === -1) {
    return res.status(404).json("No such game found");
  } else {
    games.splice(gameIndex, 1); // modyfikuje a nie usuwam
    return res.status(200).json("Game deleted");
  }
});
// moze poprawic aby zwarcac obiekty a nie stringi , ale to potem

module.exports = router;
