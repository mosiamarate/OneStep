import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../lib/firebase";
import { normalizeFocusSession } from "../types/focusSession";
import type { HistoryItem } from "../types/history";

type FirestoreData = Record<string, unknown>;

const moodEmojiMap: Record<string, string> = {
  tired: "😴",
  stressed: "🌧️",
  okay: "🤍",
  good: "🙂",
  better: "🌿",
  proud: "🌱",
  calm: "😌",
  same: "🤍",
};

function getDateValue(value: unknown): Date | null {
  if (value && typeof value === "object" && "toDate" in value) {
    const timestamp = value as { toDate?: () => Date };
    return timestamp.toDate?.() ?? null;
  }
  return null;
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeLabel(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export async function getFocusHistory(userId: string): Promise<HistoryItem[]> {
  const [sessionSnapshot, moodSnapshot] = await Promise.all([
    getDocs(query(collection(db, "focusSessions"), where("userId", "==", userId))),
    getDocs(query(collection(db, "moods"), where("userId", "==", userId))),
  ]);
  const moods = moodSnapshot.docs.map((item) => item.data() as FirestoreData);
  const afterFocusMoods = moods.filter((mood) => getStringValue(mood.phase) === "after_focus");

  return sessionSnapshot.docs
    .map((document) => {
      const session = normalizeFocusSession(document.id, document.data());
      const raw = document.data() as FirestoreData;
      const sessionDate =
        getDateValue(session.completedAt) ||
        getDateValue(session.cancelledAt) ||
        getDateValue(session.interruptedAt) ||
        getDateValue(session.startedAt);
      if (!sessionDate) return null;

      const mood = afterFocusMoods.find(
        (item) => session.taskId && getStringValue(item.taskId) === session.taskId
      );
      const moodValue = getStringValue(mood?.mood);
      const status = session.status === "completed" || session.status === "interrupted" || session.status === "cancelled"
        ? session.status
        : "unknown";

      return {
        item: {
          id: document.id,
          taskId: session.taskId,
          taskTitle: session.taskTitle,
          durationMinutes: Math.round(session.focusedSeconds / 60),
          originalDuration: session.originalDuration,
          focusedSeconds: session.focusedSeconds,
          remainingSeconds: session.remainingTime,
          interruptionCount: session.interruptionCount,
          completed: status === "completed",
          status,
          dateLabel: formatDateLabel(sessionDate),
          timeLabel: formatTimeLabel(sessionDate),
          afterMoodLabel: getStringValue(mood?.moodLabel) || null,
          afterMoodEmoji: moodValue ? moodEmojiMap[moodValue] || "🌿" : null,
          reflection: session.reflection || getStringValue(raw.reflection) || null,
        },
        sortTime: sessionDate.getTime(),
      };
    })
    .filter((value): value is { item: HistoryItem; sortTime: number } => value !== null)
    .sort((a, b) => b.sortTime - a.sortTime)
    .map((value) => value.item);
}
