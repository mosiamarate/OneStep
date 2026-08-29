import type { FocusSession } from "./focusSession";

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
    lastFocusMinutes: number;
    lastFocusAt: unknown;
    activeTask: { id: string; title: string; durationMinutes: number } | null;
    unfinishedSession: FocusSession | null;
}

export const emptyDashboardStats: DashboardStats = {
    latestMood: null,
    completedTasksToday: 0,
    focusSessionsToday: 0,
    focusMinutesToday: 0,
    lastFocusTask: null,
    lastFocusMinutes: 0,
    lastFocusAt: null,
    activeTask: null,
    unfinishedSession: null,
};
