import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { requireAuth } from "./middleware/auth";
import { chatRouter } from "./routes/chat";
import { flashcardsRouter } from "./routes/flashcards";
import { sourcesRouter } from "./routes/sources";
import { summariesRouter } from "./routes/summaries";

export const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/sources", requireAuth, sourcesRouter);
app.use("/study-sets", requireAuth, summariesRouter, flashcardsRouter);
app.use("/conversations", requireAuth, chatRouter);
app.use((_req, res) => res.status(404).json({ error: "API endpoint not found" }));

const handleError: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error);
  const status = typeof error?.status === "number" && error.status >= 400 && error.status < 600 ? error.status : 500;
  console.error("[api]", error instanceof Error ? error.message : "Request failed");
  res.status(status).json({ error: error instanceof Error ? error.message : "Request failed" });
};
app.use(handleError);

