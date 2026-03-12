import type { Request, Response } from "express";
import { current, plan } from "../services/plan.service.js";

export const planController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const result = await plan(userId);

    return res.status(200).json({
      message: "Plan generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error while Generating plan", error);
    return res.status(500).json({ error: "Failed to generate plan" });
  }
};

export const currentPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const plan = await current(userId);

    if (!plan) {
      return res.status(404).json({ error: "No plan found" });
    }

    return res.status(200).json({
      id: plan.id,
      userId: plan.user_id,
      planJson: plan.plan_json,
      planText: plan.plan_text,
      version: plan.version,
      createdAt: plan.created_at,
    });
  } catch (error) {
    console.error("Error while fetching current plan", error);
    return res.status(500).json({ error: "Failed to fetch current plan" });
  }
};
