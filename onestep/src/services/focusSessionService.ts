import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import {
  normalizeFocusSession,
  type FocusSession,
  type FocusSessionStatus,
} from "../types/focusSession";
import { MAX_FOCUS_MINUTES } from "../constants/focus";

export async function getUserFocusSessions(userId: string) {
  const snapshot = await getDocs(
    query(collection(db, "focusSessions"), where("userId", "==", userId))
  );

  return snapshot.docs.map((item) =>
    normalizeFocusSession(item.id, item.data() as Record<string, unknown>)
  );
}

export async function getFocusSession(
  userId: string,
  sessionId: string
): Promise<FocusSession | null> {
  const sessionRef = doc(db, "focusSessions", sessionId);
  const snapshot = await runTransaction(db, async (transaction) => {
    const result = await transaction.get(sessionRef);
    return result.exists() ? result.data() : null;
  });

  if (!snapshot || snapshot.userId !== userId) return null;
  return normalizeFocusSession(sessionId, snapshot as Record<string, unknown>);
}

export async function findUnfinishedFocusSession(userId: string) {
  const sessions = await getUserFocusSessions(userId);
  return sessions
    .filter((session) =>
      ["active", "paused", "interrupted"].includes(session.status)
    )
    .sort((a, b) => getTime(b.lastActiveAt ?? b.startedAt) - getTime(a.lastActiveAt ?? a.startedAt))[0] ?? null;
}

export async function createFocusSession(input: {
  userId: string;
  taskId: string;
  taskTitle: string;
  durationMinutes: number;
}) {
  const duration = Math.round(input.durationMinutes);
  if (
    !input.userId ||
    !input.taskId ||
    !input.taskTitle.trim() ||
    duration < 1 ||
    duration > MAX_FOCUS_MINUTES
  ) {
    throw new Error("Invalid focus session details.");
  }

  const existing = await findUnfinishedFocusSession(input.userId);
  if (existing) throw new Error("You already have an unfinished focus session.");

  const sessionRef = await addDoc(collection(db, "focusSessions"), {
    userId: input.userId,
    taskId: input.taskId,
    taskTitle: input.taskTitle.trim(),
    status: "active",
    originalDuration: duration,
    duration: duration,
    durationMinutes: duration,
    remainingTime: duration * 60,
    remainingSeconds: duration * 60,
    focusedSeconds: 0,
    actualDuration: 0,
    interruptionCount: 0,
    startedAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
    pausedAt: null,
    interruptedAt: null,
    completedAt: null,
    cancelledAt: null,
    completed: false,
    interrupted: false,
    createdAt: serverTimestamp(),
  });

  return normalizeFocusSession(sessionRef.id, {
    ...input,
    status: "active",
    originalDuration: duration,
    remainingTime: duration * 60,
    focusedSeconds: 0,
    interruptionCount: 0,
  });
}

export async function updateFocusSession(
  userId: string,
  sessionId: string,
  nextStatus: FocusSessionStatus,
  remainingTime: number,
  focusedSeconds: number
) {
  const sessionRef = doc(db, "focusSessions", sessionId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);
    if (!snapshot.exists()) throw new Error("Focus session not found.");

    const current = normalizeFocusSession(sessionId, snapshot.data());
    if (current.userId !== userId) throw new Error("Focus session not found.");
    if (!isAllowedTransition(current.status, nextStatus)) {
      throw new Error("This focus session can no longer be changed.");
    }

    const safeRemaining = Math.min(
      current.originalDuration * 60,
      Math.max(0, Math.round(remainingTime))
    );
    const safeFocused = Math.min(
      current.originalDuration * 60,
      Math.max(0, Math.round(focusedSeconds))
    );
    const updates: Record<string, unknown> = {
      status: nextStatus,
      remainingTime: safeRemaining,
      remainingSeconds: safeRemaining,
      focusedSeconds: safeFocused,
      actualDuration: Math.round(safeFocused / 60),
      lastActiveAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completed: nextStatus === "completed",
      interrupted: nextStatus === "interrupted",
    };

    if (nextStatus === "paused") updates.pausedAt = serverTimestamp();
    if (nextStatus === "interrupted") {
      updates.interruptedAt = serverTimestamp();
      updates.interruptionCount = current.interruptionCount + 1;
    }
    if (nextStatus === "completed") {
      updates.completedAt = serverTimestamp();
      updates.remainingTime = 0;
      updates.remainingSeconds = 0;
      updates.focusedSeconds = current.originalDuration * 60;
      updates.actualDuration = current.originalDuration;
    }
    if (nextStatus === "cancelled") updates.cancelledAt = serverTimestamp();

    transaction.update(sessionRef, updates);
  });
}

export async function updateFocusReflection(
  userId: string,
  sessionId: string,
  afterMood: string | null,
  reflection: string | null
) {
  const sessionRef = doc(db, "focusSessions", sessionId);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(sessionRef);
    if (!snapshot.exists()) throw new Error("Focus session not found.");
    const session = snapshot.data();
    if (session.userId !== userId || session.status !== "completed") {
      throw new Error("Focus session not found.");
    }
    transaction.update(sessionRef, {
      afterMood,
      reflection,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function reconcileFocusSession(userId: string, session: FocusSession) {
  if (session.status !== "active") return session;
  await updateFocusSession(
    userId,
    session.id,
    "interrupted",
    session.remainingTime,
    session.focusedSeconds
  );
  return { ...session, status: "interrupted" as const, interruptionCount: session.interruptionCount + 1 };
}

function isAllowedTransition(current: FocusSessionStatus, next: FocusSessionStatus) {
  if (current === next) return true;
  if (current === "active") return ["paused", "interrupted", "completed", "cancelled"].includes(next);
  if (current === "paused") return ["active", "interrupted", "cancelled"].includes(next);
  if (current === "interrupted") return ["active", "cancelled"].includes(next);
  return false;
}

function getTime(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value) {
    const timestamp = value as { toDate?: () => Date };
    return timestamp.toDate?.().getTime() ?? 0;
  }
  return 0;
}
