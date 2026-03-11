import OpenAI from "openai";
import { config } from "dotenv";
import type { TrainingPlan, UserProfile } from "../@types/types.js";

config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateTrainingPlan(
  profile: UserProfile,
): Promise<Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt">> {
  const normalizedProfile: UserProfile = {
    goal: profile.goal || "bulk",
    experience: profile.experience || "intermediate",
    days_per_week: profile.days_per_week || 4,
    session_length: profile.session_length || 60,
    equipment: profile.equipment || "full_gym",
    injuries: profile.injuries || null,
    preferred_split: profile.preferred_split || "upper_lower",
  };
  try {
    const prompt = `Generate a personalized training plan as strict JSON matching this TypeScript shape: { id: string, userId: string, overview: { goal: string, frequency: string, split: string, notes: string }, weeklySchedule: Array<{ day: string, focus: string, exercises: Array<{ name: string, sets: number, reps: string, rest: string, rpe: number, notes?: string, alternatives?: string[] }> }>, progression: string, version: number, createdAt: string }. User profile: ${JSON.stringify(
      profile,
    )}`;

    const response = await client.responses.create({
      model: "llama-3.3-70b-versatile",
      input:
        "You are an expert fitness trainer and program designer. Respond with valid JSON only. " +
        "Do not include markdown, reasoning, or additional text. " +
        prompt,
      temperature: 0.7,
    });

    const content = response.output_text?.trim();

    if (!content) {
      console.error(
        "[AI] No content in response:",
        JSON.stringify(response, null, 2),
      );
      throw new Error("No content in AI response");
    }

    const planData = JSON.parse(content);

    return formatPlanResponse(planData, normalizedProfile);
  } catch (error) {
    console.error("Failed to generate AI training plan:", error);
    return formatPlanResponse({}, normalizedProfile);
  }
}

function formatPlanResponse(
  aiResponse: any,
  profile: UserProfile,
): Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> {
  const plan: Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> = {
    overview: {
      goal: aiResponse.overview?.goal || `Customized ${profile.goal} program`,
      frequency:
        aiResponse.overview?.frequency ||
        `${profile.days_per_week} days per week`,
      split: aiResponse.overview?.split || profile.preferred_split,
      notes:
        aiResponse.overview?.notes ||
        "Follow the program consistently for best results.",
    },
    weeklySchedule: (aiResponse.weeklySchedule || []).map((day: any) => ({
      day: day.day || "Day",
      focus: day.focus || "Full Body",
      exercises: (day.exercises || []).map((ex: any) => ({
        name: ex.name || "Exercise",
        sets: ex.sets || 3,
        reps: ex.reps || "8-12",
        rest: ex.rest || "60-90 sec",
        rpe: ex.rpe || 7,
        notes: ex.notes,
        alternatives: ex.alternatives,
      })),
    })),
    progression:
      aiResponse.progression ||
      "Increase weight by 2.5-5lbs when you can complete all sets with good form. Track your progress weekly.",
  };
  return plan;
}