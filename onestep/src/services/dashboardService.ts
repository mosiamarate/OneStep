import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../lib/firebase";
import type { DashboardStats } from "../types/dashboard";

type FirestoreTimestampLike = {
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
    typeof (value as FirestoreTimestampLike).toDate === "function"
  ) {
    return (value as FirestoreTimestampLike).toDate();
  }

  return null;
}

function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getNumberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [moodsSnapshot, tasksSnapshot, sessionsSnapshot] = await Promise.all([
    getDocs(query(collection(db, "moods"), where("userId", "==", userId))),
    getDocs(query(collection(db, "tasks"), where("userId", "==", userId))),
    getDocs(
      query(collection(db, "focusSessions"), where("userId", "==", userId))
    ),
  ]);

  const moods = moodsSnapshot.docs.map((document) => {
    return document.data() as FirestoreData;
  });

  const tasks = tasksSnapshot.docs.map((document) => {
    return document.data() as FirestoreData;
  });

  const sessions = sessionsSnapshot.docs.map((document) => {
    return document.data() as FirestoreData;
  });

  const todayMoods = moods
    .map((mood) => {
      return {
        data: mood,
        date: getDateValue(mood.createdAt),
      };
    })
    .filter((item): item is { data: FirestoreData; date: Date } => {
      return item.date !== null && isToday(item.date);
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const latestMoodData = todayMoods[0]?.data || null;

  const latestMoodPhaseValue = getStringValue(latestMoodData?.phase);

  const latestMoodPhase: "before_focus" | "after_focus" | "unknown" =
    latestMoodPhaseValue === "before_focus" ||
    latestMoodPhaseValue === "after_focus"
      ? latestMoodPhaseValue
      : "unknown";

  const latestMood = latestMoodData
    ? {
        label:
          getStringValue(latestMoodData.moodLabel) ||
          getStringValue(latestMoodData.mood) ||
          "Mood checked in",
        emoji:
          moodEmojiMap[getStringValue(latestMoodData.mood)] ||
          moodEmojiMap[getStringValue(latestMoodData.moodLabel).toLowerCase()] ||
          "🌿",
        phase: latestMoodPhase,
      }
    : null;

  const completedTasksToday = tasks.filter((task) => {
    const completed =
      task.completed === true || getStringValue(task.status) === "completed";

    const completedDate =
      getDateValue(task.completedAt) ||
      getDateValue(task.updatedAt) ||
      getDateValue(task.createdAt);

    return completed && completedDate !== null && isToday(completedDate);
  }).length;

  let focusSessionsToday = 0;
  let focusMinutesToday = 0;
  let lastFocusTask: string | null = null;
  let latestSessionTime = 0;

  sessions.forEach((session) => {
    const completed = session.completed === true;

    const sessionDate =
      getDateValue(session.completedAt) || getDateValue(session.createdAt);

    if (!completed || !sessionDate || !isToday(sessionDate)) {
      return;
    }

    focusSessionsToday += 1;
    focusMinutesToday += getNumberValue(session.durationMinutes);

    if (sessionDate.getTime() > latestSessionTime) {
      latestSessionTime = sessionDate.getTime();
      lastFocusTask = getStringValue(session.taskTitle) || null;
    }
  });

  return {
    latestMood,
    completedTasksToday,
    focusSessionsToday,
    focusMinutesToday,
    lastFocusTask,
  };
}