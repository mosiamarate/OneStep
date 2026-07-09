export interface LatestMoodSummary {
    label: string;
    emoji: string;
    phase: "before_focus" | "after_focus" | "unknown";
}

export interface DashboardStats {
    latestMood: LatestMoodSummary | null;
    completedTasksToday: number;
    focusSessionsToday: number;
    focusMinutesToday: number;
    lastFocusTask: string | null;
}

export const emptyDashboardStats: DashboardStats = {
    latestMood: null,
    completedTasksToday: 0,
    focusSessionsToday: 0,
    focusMinutesToday: 0,
    lastFocusTask: null,
};
