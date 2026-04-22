import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: `${process.env.MAX_IMAGE_MB ?? "12"}mb` }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "listforge-enhance-api",
    timestamp: new Date().toISOString()
  });
});

app.post("/v1/photo/enhance", (_req, res) => {
  res.status(501).json({
    error: "NotImplemented",
    message:
      "Enhancement pipeline is not implemented yet. Deploy verified with this endpoint scaffold."
  });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, "0.0.0.0", () => {
  console.log(`listforge-enhance-api listening on port ${port}`);
});
