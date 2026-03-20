import { Router } from "express";
import {
	currentProfileController,
	profileController,
} from "../controllers/profile.controller.js";

const router = Router()

router.post("/", profileController)
router.get("/current", currentProfileController)

export default router