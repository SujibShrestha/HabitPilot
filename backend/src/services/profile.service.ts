import type { UserProfile } from "../@types/types.js";
import { prisma } from "../config/db.js";

export const profile = async (userId: string, profileData: UserProfile) => {
  try {
    const {
      goal,
      experience,
      days_per_week,
      session_length,
      equipment,
      injuries,
      preferred_split,
    } = profileData;

    if (
      !goal ||
      !experience ||
      !days_per_week ||
      !session_length ||
      !equipment ||
      !preferred_split
    ) {
      throw new Error("Missing required fields");
    }

    const result = await prisma.userProfile.upsert({
      where: { user_id: userId },

      update: {
        goal,
        experience,
        days_per_week,
        session_length,
        equipment,
        injuries: injuries || null,
        preferred_split,
        updated_at: new Date(),
      },

      create: {
        user_id: userId,
        goal,
        experience,
        days_per_week,
        session_length,
        equipment,
        injuries: injuries || null,
        preferred_split,
      },
    });

    return result;
  } catch (error) {
    console.error("Profile error:", error);
    throw error;
  }
};
