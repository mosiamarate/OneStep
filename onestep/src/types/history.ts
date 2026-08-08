export interface HistoryItem {
    id: string;
    taskId: string | null;
    taskTitle: string;
    durationMinutes: number;
    completed: boolean;
    status: "completed" | "ended" | "interrupted" | "unknown";
    dateLabel: string;
    timeLabel: string;
    afterMoodLabel: string | null;
    afterMoodEmoji: string | null;
}