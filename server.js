require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5001;
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = "https://api.rawg.io/api";

app.use(cors());
app.use(express.json());

// 🔹 Fetch Popular Games
console.log("Server started");
app.get("/api/games/popular", async (req, res) => {
  try {
    const response = await axios.get(`${RAWG_BASE_URL}/games`, {
      params: {
        dates: `${getLastYear()},${getCurrentDate()}`,
        ordering: "-rating",
        page_size: 10,
        key: RAWG_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch popular games" });
  }
});

// 🔹 Fetch Upcoming Games
app.get("/api/games/upcoming", async (req, res) => {
  try {
    const response = await axios.get(`${RAWG_BASE_URL}/games`, {
      params: {
        dates: `${getCurrentDate()},${getNextYear()}`,
        ordering: "-added",
        page_size: 10,
        key: RAWG_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upcoming games" });
  }
});

// 🔹 Fetch New Games
app.get("/api/games/new", async (req, res) => {
  try {
    console.log("New games endpoint hit");

    const response = await axios.get(`${RAWG_BASE_URL}/games`, {
      params: {
        dates: `${getLastYear()},${getCurrentDate()}`,
        ordering: "-released",
        page_size: 10,
        key: RAWG_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch new games" });
  }
});

// 🔹 Search for a Game
app.get("/api/games/search", async (req, res) => {
  try {
    console.log("Search endpoint hit");
    const { query } = req.query;

    const response = await axios.get(`${RAWG_BASE_URL}/games`, {
      params: { search: query, page_size: 9, key: RAWG_API_KEY },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Failed to search games" });
  }
});
// 🔹 Fetch Game Screenshots
app.get("/api/games/:id/screenshots", async (req, res) => {
  try {
    console.log("Game screenshots endpoint hit");

    const { id } = req.params;
    const response = await axios.get(
      `${RAWG_BASE_URL}/games/${id}/screenshots`,
      {
        params: { key: RAWG_API_KEY },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game screenshots" });
  }
});

// 🔹 Fetch Game Details
app.get("/api/games/:id", async (req, res) => {
  try {
    console.log("Game details endpoint hit");

    const { id } = req.params;
    const response = await axios.get(`${RAWG_BASE_URL}/games/${id}`, {
      params: { key: RAWG_API_KEY },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game details" });
  }
});

// Date Helpers
const getCurrentDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const getLastYear = () => {
  const date = new Date();
  return `${date.getFullYear() - 1}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const getNextYear = () => {
  const date = new Date();
  return `${date.getFullYear() + 1}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

// Start Server
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
