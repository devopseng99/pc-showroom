import { Router } from "express";
import { sseBroadcaster } from "../services/sse-broadcaster.js";

export const eventsRouter = Router();

eventsRouter.get("/stream", (req, res) => {
  sseBroadcaster.addClient(req, res);
});
