import express, { Router } from "express";
import { googleAuthController } from "../controllers/auth.controller.js";


const router:Router = express.Router();

router.post("/", googleAuthController);

export default router;