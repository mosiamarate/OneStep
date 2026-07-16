import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../lib/firebase";
import type { HistoryItem } from "../types/history";

type FirestoreTimeStampLike = {
    toDate: () => Date;
};

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
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as FirestoreTimeStampLike).toDate === "function"
  ) {
    return (value as FirestoreTimeStampLike).toDate();
  }

  return null;
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getNumberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatDateLabel (date: Date) {
    return date.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatTimeLabel (date: Date) {
    return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit" 
    });
}

export async function getFocusHistory(userId: string): Promise<HistoryItem[]> {
    const [sessionSnapshot, moodSnapshot] = await Promise.all([
        getDocs(
            query(collection(db, "focusSessions"), where("userId", "==", userId))
        ),
        getDocs(query(collection(db, "moods"), where("userId", "==", userId))),
        
    ]);

    const afterFocusMoods = moodSnapshot.docs
        .map((document) => document.data() as FirestoreData)
        .filter((mood) => getStringValue(mood.phase) === "after_focus");

    const HistoryItems = sessionSnapshot.docs
        .map((document) => {
            const session = document.data() as FirestoreData;

            const taskId = getStringValue(session.taskId) || null;
            const taskTitle = 
                getStringValue(session.taskTitle) || "Untitled focus session";

            const sessionDate = 
                getDateValue(session.completedAt) || getDateValue(session.createdAt);

            if (!sessionDate) {
                return null;
            }

            const matchedAfterMood = afterFocusMoods.find((mood) => {
                const moodTaskId = getStringValue(mood.taskId);
                return taskId && moodTaskId === taskId;
            });

            const afterMoodValue = getStringValue(matchedAfterMood?.mood);
            const afterMoodLabel = 
                getStringValue(matchedAfterMood?.moodLabel) || null;
            
            const completed = session.completed === true;

            const item: HistoryItem = {
                id: document.id,
                taskId,
                taskTitle,
                durationMinutes: getNumberValue(session.durationMinutes),
                completed,
                status: completed ? "completed" : "unknown",
                dateLabel: formatDateLabel(sessionDate),
                timeLabel: formatTimeLabel(sessionDate),
                afterMoodLabel,
                afterMoodEmoji: afterMoodValue
                    ? moodEmojiMap[afterMoodValue] || "🌿"
                    : null,
            };

            return {
                item,
                sortTime: sessionDate.getTime(),
            };
        })
        .filter(
            (
                value
            ): value is {
                item: HistoryItem;
                sortTime: number;
            } => value !== null
        )
        .sort((a, b) => b.sortTime - a.sortTime)
        .map((value) => value.item);

    return HistoryItems;

}