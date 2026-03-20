import type { Request, Response } from "express";
import { getProfileByUserId, profile } from "../services/profile.service.js";

export const profileController = async (req: Request, res: Response) => {
  try {
    const {...profileData } = req.body;
 
    if (!profileData.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const result = await profile(profileData.userId, profileData);
    return res.status(200).json({
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
};

export const currentProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await getProfileByUserId(userId);

    if (!result) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json({
      userId: result.user_id,
      goal: result.goal,
      experience: result.experience,
      days_per_week: result.days_per_week,
      session_length: result.session_length,
      equipment: result.equipment,
      injuries: result.injuries,
      preferred_split: result.preferred_split,
      updated_at: result.updated_at,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};
