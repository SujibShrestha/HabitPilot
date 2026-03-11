import type { Request, Response } from "express";
import { plan } from "../services/plan.service.js";

export const planController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const result = await plan(userId)
console.log(result)

    return res.status(200).json({
      message: "Plan generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error while Generating plan", error);
    return res.status(500).json({ error: "Failed to generate plan" });
  }
};
