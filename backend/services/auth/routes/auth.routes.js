import express from "express";
import { login, logout, updateUserPayment } from "../controllers/auth.controller.js";

const router = express.Router();

router.post ("/login", login);

router.get("/logout", logout);

router.post("/update-plan", updateUserPayment);

export default router;