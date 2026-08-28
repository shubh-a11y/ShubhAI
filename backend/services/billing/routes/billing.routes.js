// backend/services/billing/routes/billing.routes.js

import express from "express";
import { createOrder, verifyPayment } from "../controllers/billing.controller.js";

const router = express.Router();
router.post("/create", createOrder);
router.post("/verify", verifyPayment);

export default router;


