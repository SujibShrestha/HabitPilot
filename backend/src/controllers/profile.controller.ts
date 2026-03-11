import type { Request, Response } from "express";
import { profile } from "../services/profile.service.js";

export const profileController = async (req: Request, res: Response) => {
  try {
    const { userId, ...profileData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const result = await profile(userId, profileData);

    return res.status(200).json({
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
};
