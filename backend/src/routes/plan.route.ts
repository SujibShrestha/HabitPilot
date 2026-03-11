import { Router } from "express";
import { planController } from "../controllers/plan.controller.js";

const router = Router()

router.post("/generate", planController)

export default router