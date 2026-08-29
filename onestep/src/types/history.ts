export interface HistoryItem {
    id: string;
    taskId: string | null;
    taskTitle: string;
    durationMinutes: number;
    originalDuration: number;
    focusedSeconds: number;
    remainingSeconds: number;
    interruptionCount: number;
    completed: boolean;
    status: "completed" | "interrupted" | "cancelled" | "unknown";
    dateLabel: string;
    timeLabel: string;
    afterMoodLabel: string | null;
    afterMoodEmoji: string | null;
    reflection: string | null;
}