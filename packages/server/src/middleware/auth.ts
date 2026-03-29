import type { Request, Response, NextFunction } from "express";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "showroom-admin-2026";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "Authorization header required" });
    return;
  }

  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  if (token !== ADMIN_TOKEN) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }

  next();
}

// Verify endpoint — client uses this to check if token is valid
export function authRouter() {
  const { Router } = require("express");
  const router = Router();

  router.post("/verify", (req: Request, res: Response) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : header;
    if (token === ADMIN_TOKEN) {
      res.json({ valid: true });
    } else {
      res.status(403).json({ valid: false });
    }
  });

  return router;
}
