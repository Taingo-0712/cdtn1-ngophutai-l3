const express = require("express");
require("dotenv").config();

const pool = require("./db");
const opportunityRoutes = require("./routes/opportunity.routes");

const app = express();

app.use(express.json());

app.use("/api/opportunities", opportunityRoutes);

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server dang chay tai http://localhost:${PORT}`);
});