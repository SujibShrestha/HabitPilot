import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../api/api";
import { setProfile, setError as setProfileError } from "../store/profileSlice";
import type { RootState } from "../store/store";
import type { UserProfile } from "../store/profileSlice";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const ProfileSetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { loading, error } = useSelector((state: RootState) => state.profile);

  const [formData, setFormData] = useState<UserProfile>({
    goal: "",
    experience: "",
    days_per_week: 3,
    session_length: 60,
    equipment: "",
    injuries: "",
    preferred_split: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "days_per_week" || name === "session_length"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId) return;

    try {
      dispatch(setProfileError(""));
      await updateUserProfile({ userId, ...formData }, token);
      dispatch(setProfile(formData));
      setSuccessMessage("Profile updated successfully! Redirecting...");
      setTimeout(() => navigate("/plans"), 1500);
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.response?.data?.error || "Failed to update profile";
      dispatch(setProfileError(errorMsg));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-border/50">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              Fitness Profile Setup
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
              Tell us about your fitness goals so we can create a personalized
              training plan for you
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-6 p-3 sm:p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-start gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm">
                {successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Goal */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">
                Fitness Goal
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm transition"
              >
                <option value="">Select your goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Strength">Strength</option>
                <option value="Endurance">Endurance</option>
                <option value="Athletic Performance">Athletic Performance</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">
                Experience Level
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm transition"
              >
                <option value="">Select your experience</option>
                <option value="Beginner">Beginner (0-1 years)</option>
                <option value="Intermediate">Intermediate (1-3 years)</option>
                <option value="Advanced">Advanced (3-5 years)</option>
                <option value="Elite">Elite (5+ years)</option>
              </select>
            </div>

            {/* Days Per Week & Session Length */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">
                  Days Per Week
                </label>
                <input
                  type="number"
                  name="days_per_week"
                  value={formData.days_per_week}
                  onChange={handleChange}
                  min="1"
                  max="7"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm transition"
                />
              </div>

              {/* Session Length */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">
                  Session Length (minutes)
                </label>
                <input
                  type="number"
                  name="session_length"
                  value={formData.session_length}
                  onChange={handleChange}
                  min="15"
                  max="180"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm transition"
                />
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">
                Available Equipment
              </label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm transition"
              >
                <option value="">Select equipment</option>
                <option value="Full Gym">Full Gym (Barbells, Dumbbells, Machines)</option>
                <option value="Dumbbells">Dumbbells Only</option>
                <option value="Barbells">Barbells & Weights</option>
                <option value="Calisthenics">Calisthenics (Bodyweight)</option>
                <option value="Home Gym">Home Gym (Limited Equipment)</option>
                <option value="Machines">Machines Only</option>
              </select>
            </div>

            {/* Preferred Split */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">
                Preferred Training Split
              </label>
              <select
                name="preferred_split"
                value={formData.preferred_split}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm transition"
              >
                <option value="">Select split</option>
                <option value="Full Body">Full Body (3-4x per week)</option>
                <option value="Upper/Lower">Upper/Lower Split (4x per week)</option>
                <option value="Push/Pull/Legs">Push/Pull/Legs (6x per week)</option>
                <option value="Bro Split">Bro Split (5x per week)</option>
                <option value="Hypertrophy">Hypertrophy Focused</option>
                <option value="Strength">Strength Focused</option>
              </select>
            </div>

            {/* Injuries */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">
                Injuries or Limitations (Optional)
              </label>
              <textarea
                name="injuries"
                value={formData.injuries}
                onChange={handleChange}
                placeholder="E.g., Lower back pain, Shoulder injury, etc. This helps us customize your plan."
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition resize-none h-20 sm:h-24 text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                  Setting up profile...
                </>
              ) : (
                "Create Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
