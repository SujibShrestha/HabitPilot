import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  rpe: number;
  notes?: string;
  alternatives?: string[];
}

export interface DaySchedule {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface TrainingPlan {
  id: string;
  userId: string;
  overview: {
    goal: string;
    frequency: string;
    split: string;
    notes: string;
  };
  weeklySchedule: DaySchedule[];
  progression: string;
  version: number;
  createdAt: string;
}

interface PlansState {
  currentPlan: TrainingPlan | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  hasPlan: boolean;
}

const initialState: PlansState = {
  currentPlan: null,
  loading: false,
  generating: false,
  error: null,
  hasPlan: false,
};

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.generating = action.payload;
    },
    setPlan: (state, action: PayloadAction<TrainingPlan>) => {
      state.currentPlan = action.payload;
      state.hasPlan = true;
      state.error = null;
      state.loading = false;
      state.generating = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.generating = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPlan: (state) => {
      state.currentPlan = null;
      state.hasPlan = false;
      state.loading = false;
      state.generating = false;
      state.error = null;
    },
    setNoPlan: (state) => {
      state.currentPlan = null;
      state.hasPlan = false;
      state.loading = false;
    },
  },
});

export const { setLoading, setGenerating, setPlan, setError, clearError, resetPlan, setNoPlan } =
  plansSlice.actions;
export default plansSlice.reducer;
