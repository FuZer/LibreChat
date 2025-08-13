import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/health", (_, res) => res.json({ ok: true }));

// \uC0D8\uD50C GeoJSON \uC81C\uACF5
app.get("/geo/sample", (_, res) => {
  const p = path.join(__dirname, "sample", "sample.geojson");
  const text = fs.readFileSync(p, "utf-8");
  res.setHeader("Content-Type", "application/geo+json; charset=utf-8");
  res.send(text);
});

// \uC784\uC758 \uD3EC\uC778\uD2B8 \uC0DD\uC131(bbox=minLon,minLat,maxLon,maxLat)
app.get("/geo/points", (req, res) => {
  const bbox = String(req.query.bbox || "");
  const n = Math.min(Number(req.query.n || 200), 2000);
  const parts = bbox.split(",").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) {
    return res.status(400).json({ error: "bbox=minLon,minLat,maxLon,maxLat" });
  }
  const [minX, minY, maxX, maxY] = parts;
  const features = Array.from({ length: n }).map((_, i) => ({
    type: "Feature",
    properties: { id: i + 1 },
    geometry: {
      type: "Point",
      coordinates: [
        Math.random() * (maxX - minX) + minX,
        Math.random() * (maxY - minY) + minY
      ]
    }
  }));
  res.json({ type: "FeatureCollection", features });
});

// \uAC04\uC774 WMS/\uD0C0\uC77C \uD504\uB85D\uC2DC (GET /wms?url=ENCODED_URL)
app.get("/wms", async (req, res) => {
  const raw = String(req.query.url || "");
  if (!raw) return res.status(400).json({ error: "url required" });
  try {
    const target = decodeURIComponent(raw);
    const r = await fetch(target);
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/octet-stream");
    res.send(buf);
  } catch (e) {
    res.status(502).json({ error: "proxy_failed" });
  }
});

// self-contained \uC9C0\uB3C4 UI
app.get("/ui.html", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "ui.html"));
});

app.listen(PORT, () => {
  console.log(`[geo-tool] listening on http://localhost:${PORT}`);
});

