export type FocusSessionStatus =
  | "active"
  | "paused"
  | "interrupted"
  | "completed"
  | "cancelled";

export interface FocusSession {
  id: string;
  userId: string;
  taskId: string | null;
  taskTitle: string;
  status: FocusSessionStatus;
  originalDuration: number;
  remainingTime: number;
  focusedSeconds: number;
  interruptionCount: number;
  startedAt: unknown;
  lastActiveAt: unknown;
  pausedAt: unknown;
  interruptedAt: unknown;
  completedAt: unknown;
  cancelledAt: unknown;
  beforeMood: string | null;
  afterMood: string | null;
  reflection: string | null;
}

export const unfinishedStatuses: FocusSessionStatus[] = [
  "active",
  "paused",
  "interrupted",
];

export function normalizeFocusSession(
  id: string,
  data: Record<string, unknown>
): FocusSession {
  const originalDuration = clampNumber(
    data.originalDuration ?? data.durationMinutes ?? data.duration,
    1,
    180,
    25
  );
  const legacyActualMinutes = clampNumber(
    data.actualDuration,
    0,
    originalDuration,
    0
  );
  const focusedSeconds = clampNumber(
    data.focusedSeconds,
    0,
    originalDuration * 60,
    legacyActualMinutes * 60
  );
  const remainingTime = clampNumber(
    data.remainingTime ?? data.remainingSeconds,
    0,
    originalDuration * 60,
    Math.max(0, originalDuration * 60 - focusedSeconds)
  );

  return {
    id,
    userId: typeof data.userId === "string" ? data.userId : "",
    taskId: typeof data.taskId === "string" ? data.taskId : null,
    taskTitle:
      typeof data.taskTitle === "string" && data.taskTitle.trim()
        ? data.taskTitle
        : "Untitled focus session",
    status: getStatus(data),
    originalDuration,
    remainingTime,
    focusedSeconds: Math.min(
      originalDuration * 60,
      Math.max(focusedSeconds, originalDuration * 60 - remainingTime)
    ),
    interruptionCount: clampNumber(data.interruptionCount, 0, 100, 0),
    startedAt: data.startedAt ?? data.createdAt ?? null,
    lastActiveAt: data.lastActiveAt ?? null,
    pausedAt: data.pausedAt ?? null,
    interruptedAt: data.interruptedAt ?? null,
    completedAt: data.completedAt ?? null,
    cancelledAt: data.cancelledAt ?? null,
    beforeMood: typeof data.beforeMood === "string" ? data.beforeMood : null,
    afterMood: typeof data.afterMood === "string" ? data.afterMood : null,
    reflection: typeof data.reflection === "string" ? data.reflection : null,
  };
}

function getStatus(data: Record<string, unknown>): FocusSessionStatus {
  const status = data.status;
  if (
    status === "active" ||
    status === "paused" ||
    status === "interrupted" ||
    status === "completed" ||
    status === "cancelled"
  ) {
    return status;
  }

  if (data.completed === true) return "completed";
  if (data.interrupted === true) return "interrupted";
  return "completed";
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const number = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, number));
}
