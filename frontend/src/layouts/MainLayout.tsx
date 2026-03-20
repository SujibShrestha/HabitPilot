import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentProfile } from "../api/api";
import type { RootState } from "../store/store";
import {
  resetProfile,
  setError as setProfileError,
  setProfile,
} from "../store/profileSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      dispatch(resetProfile());
      return;
    }

    const hydrateProfile = async () => {
      try {
        const profile = await getCurrentProfile(token);
        dispatch(
          setProfile({
            goal: profile.goal,
            experience: profile.experience,
            days_per_week: profile.days_per_week,
            session_length: profile.session_length,
            equipment: profile.equipment,
            injuries: profile.injuries || "",
            preferred_split: profile.preferred_split,
            updated_at: profile.updated_at,
          }),
        );
      } catch (err: any) {
        if (err?.response?.status === 404) {
          dispatch(resetProfile());
          return;
        }

        const errorMessage =
          err?.response?.data?.error || "Failed to fetch profile";
        dispatch(setProfileError(errorMessage));
      }
    };

    hydrateProfile();
  }, [token, dispatch]);

  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default MainLayout;