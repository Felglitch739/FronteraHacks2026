export type FitnessGoal = 'bulk' | 'cut' | 'maintain';

export type WorkoutExercise = {
    name: string;
    sets?: string | number;
    reps?: string;
    rest?: string;
    notes?: string;
};

export type WeeklyPlanDay = {
    day: string;
    focus: string;
    durationMinutes?: number;
    intensity?: 'low' | 'moderate' | 'high';
    exercises?: WorkoutExercise[];
    notes?: string;
};

export type WeeklyPlanData = {
    goal: FitnessGoal;
    days: WeeklyPlanDay[];
    notes?: string[];
};

export type DailyCheckInValues = {
    sleepHours: number | '';
    stressLevel: number | '';
    soreness: number | '';
};

export type RecommendationData = {
    readinessScore: number;
    planned: string;
    adjusted: string;
    workoutJson: {
        title?: string;
        summary?: string;
        exercises?: WorkoutExercise[];
        notes?: string[];
    };
    nutritionTip: string;
    message?: string;
};

export type DashboardViewModel = {
    weeklyPlan?: WeeklyPlanData | null;
    dailyCheckIn?: DailyCheckInValues | null;
    recommendation?: RecommendationData | null;
    currentDayLabel?: string;
};
