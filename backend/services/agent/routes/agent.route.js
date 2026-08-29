import multer from "../config/multer.js";
import { agent } from "../controllers/agent.controller.js";
import express from "express";

const router = express.Router();

router.post("/chat",multer.single("file"), agent);

export default router;