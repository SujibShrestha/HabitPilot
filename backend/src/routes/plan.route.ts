import { Router } from "express";
import { currentPlan, planController } from "../controllers/plan.controller.js";

const router = Router()

router.post("/generate", planController)
router.get("/current",currentPlan)

export default router