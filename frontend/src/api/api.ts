import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const googleUser = async (token: string) => {
  const res = await api.post("/auth", { token });
  return res.data;
};

// Profile APIs
export const updateUserProfile = async (
  profileData: {
    userId:string;
    goal: string;
    experience: string;
    days_per_week: number;
    session_length: number;
    equipment: string;
    injuries?: string;
    preferred_split: string;
  },
  token: string
) => {
  console.log(profileData)
  const res = await api.post("/profile", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Plan APIs
export const generateTrainingPlan = async (token: string, userId?: string) => {
  const res = await api.post(
    "/plan/generate",
    userId ? { userId } : {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getCurrentTrainingPlan = async (token: string) => {
  const res = await api.get("/plan/current", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};