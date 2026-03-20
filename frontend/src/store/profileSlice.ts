import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  goal: string;
  experience: string;
  days_per_week: number;
  session_length: number;
  equipment: string;
  injuries?: string;
  preferred_split: string;
  updated_at?: string;
}

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isSetup: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  isSetup: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isSetup = true;
      state.error = null;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProfile: (state) => {
      state.profile = null;
      state.isSetup = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setProfile, setError, clearError, resetProfile } =
  profileSlice.actions;
export default profileSlice.reducer;
