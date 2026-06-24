const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5050;
const AUTH_TARGET = process.env.FLEETOS_AUTH_TARGET || "https://fleetosauth.unisys.am";
const DATA_TARGET = process.env.FLEETOS_DATA_TARGET || "https://fleetosapi.unisys.am";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "FleetOS local proxy", port: PORT });
});

async function proxyRequest(targetBaseUrl, req, res) {
  try {
    const response = await fetch(`${targetBaseUrl}${req.originalUrl}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Accept": req.headers.accept || "application/json",
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body || {}),
    });

    const text = await response.text();
    res.status(response.status);
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    res.send(text);
  } catch (error) {
    res.status(500).json({
      message: "Proxy error",
      error: error.message,
    });
  }
}

app.use("/api/Auth", (req, res) => proxyRequest(AUTH_TARGET, req, res));
app.use("/api", (req, res) => proxyRequest(DATA_TARGET, req, res));

app.listen(PORT, () => {
  console.log(`FleetOS proxy running on http://localhost:${PORT}`);
  console.log(`Auth API -> ${AUTH_TARGET}`);
  console.log(`Data API -> ${DATA_TARGET}`);
});
