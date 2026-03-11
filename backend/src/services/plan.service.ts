import { prisma } from "../config/db.js";
import { generateTrainingPlan } from "../helpers/ai.js";

export const plan = async (userId: string) => {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: userId },
    });
    if (!profile) {
      throw new Error("User not found");
    }

    const latestPlan = await prisma.trainingPlans.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      select: { version: true },
    });

    const nextVersion = latestPlan ? latestPlan.version + 1 : 1;

    let planJson;
    try {
      planJson = await generateTrainingPlan(profile);
    } catch (error) {
      console.error("AI generation failed:", error);
    }
    const planText = JSON.stringify(planJson, null, 2);
    const newPlan = await prisma.trainingPlans.create({
      data: {
        user_id: userId,
        plan_json: planJson as any,
        plan_text: planText,
        version: nextVersion,
      },
    });

    return newPlan;
  } catch (error) {
    console.error("Error while Generating plan", error);
  }
};
