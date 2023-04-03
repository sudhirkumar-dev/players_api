const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
app.use(express.json());

const initializeServerAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (e) {
    console.log(`DB error: ${e.message}`);
    process.exit(1);
  }
};
initializeServerAndDb();

// GET PLAYERs API

app.get("/players/", async (req, res) => {
  const getPlayersQuery = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const playerArray = await db.all(getPlayersQuery);
  res.send(playerArray);
});

// get single player

app.get("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  res.send(player);
});

// POST PLAYER API

app.post("/players/", (req, res) => {
  const playerDetails = req.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerDetails = `INSERT INTO cricket_team (playerName,jerseyNumber,role) VALUES 
    (${playerNAme},${jerseyNumber},${role});`;
  const dbResponse = db.run(addPlayerDetails);
  const playerId = dbResponse.lastID;
  res.send({ playerId: playerId });
  res.send("Player Added to Team");
});

//PUT PLAYER API

app.put("/players/:playerId", (req, res) => {
  const { playerId } = req.params;
  const playerDetails = req.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `UPDATE cricket_team SET player_name = ${playerName},jersey_number = ${jerseyNumber},role = ${role} WHERE player_id = ${playerId};`;
  db.run(updatePlayerDetails);
  res.send("Player Details Updated");
});

// DELETE PLAYER API

app.delete("/players/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const deletePlayer = `
    DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(deletePlayer);
  res.send("Player Removed");
});

module.exports = app;
