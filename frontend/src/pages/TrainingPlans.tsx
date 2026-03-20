import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentTrainingPlan, generateTrainingPlan } from "../api/api";
import {
  setPlan,
  setLoading,
  setGenerating,
  setError,
  setNoPlan,
} from "../store/plansSlice";
import type { RootState } from "../store/store";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Zap,
  Calendar,
  Dumbbell,
} from "lucide-react";

interface CollapsedState {
  [key: string]: boolean;
}

const TrainingPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const profile = useSelector((state: RootState) => state.profile.profile);
  const { currentPlan, loading, generating, error } = useSelector(
    (state: RootState) => state.plans,
  );
  const [collapsed, setCollapsed] = useState<CollapsedState>({});

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    fetchPlan();
  }, [token]);

  const fetchPlan = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getCurrentTrainingPlan(token!);
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
          }),
        );
      } else {
        dispatch(setNoPlan());
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error || "Failed to load plan";
      if ((err as any)?.response?.status === 404) {
        dispatch(setNoPlan());
      } else {
        dispatch(setError(errorMessage));
      }
    }
  };

  const handleGeneratePlan = async () => {
    if (!profile) {
      navigate("/profile");
      return;
    }

    try {
      dispatch(setGenerating(true));
      await generateTrainingPlan(token!, userId);
      await fetchPlan();
    } catch (err: unknown) {
      const errorMsg =
        (err as any)?.response?.data?.error ||
        "Failed to generate plan. Please try again.";
      dispatch(setError(errorMsg));
    }
  };

  const toggleDay = (day: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card py-6 sm:py-12 px-3 sm:px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 sm:w-12 h-10 sm:h-12 animate-spin text-primary mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">
            Loading your training plan...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card py-6 sm:py-12 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-border/50">
            <div className="flex items-start gap-2 sm:gap-4 mb-4 sm:mb-6">
              <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-destructive mb-1 sm:mb-2">
                  Error Loading Plan
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {error}
                </p>
              </div>
            </div>
            <button
              onClick={fetchPlan}
              className="px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card py-6 sm:py-12 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-border/50 text-center">
            <Dumbbell className="w-12 sm:w-16 h-12 sm:h-16 text-primary mx-auto mb-3 sm:mb-4 opacity-50" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
              No Training Plan Yet
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
              Let's create your personalized AI-generated training plan based on
              your fitness profile and goals.
            </p>
            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 sm:p-6 lg:p-8 border border-border/50">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
              Your Training Plan
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Version {currentPlan.version} • Generated on{" "}
              {new Date(currentPlan.createdAt).toLocaleDateString()}
            </p>

            {currentPlan.overview && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div className="bg-card/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Goal</p>
                  <p className="font-semibold text-sm text-foreground">
                    {currentPlan.overview.goal}
                  </p>
                </div>
                <div className="bg-card/50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Split</p>
                  <p className="font-semibold text-sm text-foreground">
                    {currentPlan.overview.split}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overview Notes */}
        {currentPlan.overview?.notes && (
          <div className="mb-6 sm:mb-8 bg-card rounded-xl p-4 sm:p-6 border border-border/50 shadow-lg">
            <h2 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">
              Plan Overview
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {currentPlan.overview.notes}
            </p>
          </div>
        )}

        {/* Weekly Schedule */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-primary flex-shrink-0" />
            Weekly Schedule
          </h2>

          <div className="space-y-2 sm:space-y-3">
            {currentPlan.weeklySchedule &&
              currentPlan.weeklySchedule.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-lg transition hover:shadow-xl"
                >
                  {/* Day Header */}
                  <button
                    onClick={() => toggleDay(day.day)}
                    className="w-full px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-secondary/10 transition active:bg-secondary/20"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-primary">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="text-left min-w-0">
                        <h3 className="font-bold text-foreground text-sm sm:text-base">
                          {day.day}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {day.focus}
                        </p>
                      </div>
                    </div>
                    {collapsed[day.day] ? (
                      <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground flex-shrink-0 ml-2" />
                    )}
                  </button>

                  {/* Exercises - Collapsed/Expanded */}
                  {!collapsed[day.day] && (
                    <div className="border-t border-border/30 bg-background/40">
                      <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                        {day.exercises && day.exercises.length > 0 ? (
                          day.exercises.map((exercise, exIdx) => (
                            <div
                              key={exIdx}
                              className="space-y-1.5 sm:space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-foreground text-xs sm:text-base">
                                    {exIdx + 1}. {exercise.name}
                                  </h4>
                                  <div className="flex flex-wrap gap-1.5 sm:gap-3 mt-1.5 sm:mt-2 text-xs">
                                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/20 text-primary rounded-full whitespace-nowrap">
                                      {exercise.sets} × {exercise.reps}
                                    </span>
                                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-secondary/20 text-secondary-foreground rounded-full whitespace-nowrap">
                                      Rest: {exercise.rest}
                                    </span>
                                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-accent/20 text-accent-foreground rounded-full whitespace-nowrap">
                                      RPE: {exercise.rpe}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {exercise.notes && (
                                <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                                  💡 {exercise.notes}
                                </p>
                              )}
                              {exercise.alternatives &&
                                exercise.alternatives.length > 0 && (
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    <span className="font-semibold">
                                      Alternatives:
                                    </span>{" "}
                                    {exercise.alternatives.join(", ")}
                                  </p>
                                )}
                              {exIdx < day.exercises.length - 1 && (
                                <div className="border-t border-border/20 pt-4" />
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Rest day
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Progression Notes */}
        {currentPlan.progression && (
          <div className="mb-6 sm:mb-8 bg-card rounded-xl p-4 sm:p-6 border border-border/50 shadow-lg">
            <h2 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">
              Progression Strategy
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {currentPlan.progression}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 sm:w-5 h-4 sm:h-5" />
                Generate New Plan
              </>
            )}
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition text-sm sm:text-base"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlans;
