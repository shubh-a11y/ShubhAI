import { agent } from "../controllers/agent.controller.js";
import express from "express";

const router = express.Router();

router.post("/chat", agent);

export default router;