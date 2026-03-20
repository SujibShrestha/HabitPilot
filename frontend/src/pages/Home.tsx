import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPlan, setNoPlan } from "../store/plansSlice";
import { getCurrentTrainingPlan } from "../api/api";
import type { RootState } from "../store/store";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Target,
  Calendar,
  Flame,
} from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const { profile, isSetup } = useSelector((state: RootState) => state.profile);
  const { currentPlan } = useSelector((state: RootState) => state.plans);

  const parsedFrequencyDays = (() => {
    const frequency = currentPlan?.overview?.frequency;
    if (!frequency) return null;
    const match = frequency.match(/\d+/);
    return match ? Number(match[0]) : null;
  })();

  const daysPerWeekValue =
    profile?.days_per_week ??
    (currentPlan?.weeklySchedule?.length
      ? currentPlan.weeklySchedule.length
      : parsedFrequencyDays);

  const sessionLengthValue = profile?.session_length ?? null;
console.log(profile)
  const weeklyVolumeValue =
    currentPlan?.weeklySchedule?.reduce((total, day) => {
      const exercises =
        (day as any)?.exercises ?? (day as any)?.workouts ?? (day as any)?.items ?? [];
      return total + (Array.isArray(exercises) ? exercises.length : 0);
    }, 0) ?? null;

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchPlanIfExists = async () => {
      try {
        const response = await getCurrentTrainingPlan(token);
        const planResponse = response?.data ?? response;
        const rawPlanJson = planResponse?.plan_json ?? planResponse?.planJson;

        if (planResponse && rawPlanJson) {
          const planData =
            typeof rawPlanJson === "string" ? JSON.parse(rawPlanJson) : rawPlanJson;
          const weeklySchedule =
            planData?.weeklySchedule ?? planData?.weekly_schedule ?? [];
          dispatch(
            setPlan({
              id: planResponse.id,
              userId: planResponse.user_id ?? planResponse.userId,
              overview: planData.overview || {},
              weeklySchedule,
              progression: planData.progression || "",
              version: planResponse.version || 1,
              createdAt: planResponse.created_at ?? planResponse.createdAt,
            })
          );
        } else {
          dispatch(setNoPlan());
        }
      } catch {
        // No plan exists yet, that's okay
        dispatch(setNoPlan());
      }
    };

    fetchPlanIfExists();
  }, [token, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 break-words">
            Welcome back, <span className="text-primary">{user?.name}</span>!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Let's build your perfect fitness journey with AI-powered training
            plans
          </p>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Profile Status Card */}
          <div
            className={`rounded-2xl shadow-xl overflow-hidden border transition-all hover:shadow-2xl cursor-pointer ${
              isSetup
                ? "bg-linear-to-br from-green-500/10 to-green-600/10 border-green-500/30"
                : "bg-linear-to-br from-amber-500/10 to-amber-600/10 border-amber-500/30"
            }`}
            onClick={() => !isSetup && navigate("/profile")}
          >
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSetup
                        ? "bg-green-500/30"
                        : "bg-amber-500/30"
                    }`}
                  >
                    {isSetup ? (
                      <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">
                      Profile Status
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {isSetup ? "Profile Complete" : "Profile Incomplete"}
                    </p>
                  </div>
                </div>
              </div>

              {!isSetup ? (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                    Complete your fitness profile to get started with your
                    personalized training plan.
                  </p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition text-sm"
                  >
                    Setup Profile
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-xs sm:text-sm">
                  {profile && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Goal:</span>
                        <span className="font-semibold text-foreground text-right ml-2">
                          {profile.goal}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Experience:
                        </span>
                        <span className="font-semibold text-foreground text-right ml-2">
                          {profile.experience}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Days/Week:
                        </span>
                        <span className="font-semibold text-foreground text-right ml-2">
                          {profile.days_per_week}x
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Training Plan Status Card */}
          <div
            className={`rounded-2xl shadow-xl overflow-hidden border transition-all hover:shadow-2xl ${
              currentPlan
                ? "bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30"
                : "bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30"
            }`}
          >
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      currentPlan
                        ? "bg-blue-500/30"
                        : "bg-purple-500/30"
                    }`}
                  >
                    {currentPlan ? (
                      <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-blue-500" />
                    ) : (
                      <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">
                      Training Plan
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {currentPlan ? "Plan Ready" : "No Plan Yet"}
                    </p>
                  </div>
                </div>
              </div>

              {!currentPlan ? (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                    {isSetup
                      ? "Generate your AI-powered training plan tailored to your goals."
                      : "Complete your profile first to generate a plan."}
                  </p>
                  <button
                    onClick={() => navigate("/plans")}
                    disabled={!isSetup}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    View Plans
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-xs sm:text-sm">
                  {currentPlan.overview && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Goal:</span>
                        <span className="font-semibold text-foreground text-right ml-2">
                          {currentPlan.overview.goal}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Split:</span>
                        <span className="font-semibold text-foreground text-right ml-2">
                          {currentPlan.overview.split}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Version:</span>
                        <span className="font-semibold text-foreground text-right ml-2">
                          v{currentPlan.version}
                        </span>
                      </div>
                    </>
                  )}
                  <button
                    onClick={() => navigate("/plans")}
                    className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition text-sm"
                  >
                    View Full Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {currentPlan && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              Your Plan Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border/50 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Days/Week</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {daysPerWeekValue ?? "—"}
                </p>
              </div>

              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border/50 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Flame className="w-4 sm:w-5 h-4 sm:h-5 text-destructive flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Session Length
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {sessionLengthValue ?? "—"}
                  {sessionLengthValue !== null && (
                    <span className="text-base sm:text-lg text-muted-foreground">min</span>
                  )}
                </p>
              </div>

              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border/50 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Target className="w-4 sm:w-5 h-4 sm:h-5 text-accent flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Weekly Volume
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {weeklyVolumeValue ?? "—"}
                  <span className="text-base sm:text-lg text-muted-foreground">
                    {" "}
                    ex.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {isSetup && currentPlan && (
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 sm:p-8 lg:p-12 border border-border/50 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Ready to crush your goals?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Your personalized training plan is ready. Review your weekly
              schedule and start your first workout today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => navigate("/plans")}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
                View Your Plan
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition text-sm sm:text-base"
              >
                Update Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
