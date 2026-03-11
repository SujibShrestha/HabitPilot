import { Router } from "express";
import { profileController } from "../controllers/profile.controller.js";

const router = Router()

router.post("/", profileController)

export default router