import cors from "cors";
import express from "express";
import { env } from "./config/env.js";

import { errorHandler } from "./middleware/error-handler.js";
import importRoutes from "./routes/import.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: env.CLIENT_URL, 
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "GrowEasy CSV Importer API is running.",
  });
});

app.use("/api/import", importRoutes);

app.use(errorHandler);

export default app;