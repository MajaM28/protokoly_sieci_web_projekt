const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const gameRoutes = require("./routes/games");
app.use("/api/games", gameRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
