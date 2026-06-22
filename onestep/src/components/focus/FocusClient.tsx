"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";

interface WindowWithDocumentPictureInPicture extends Window {
  documentPictureInPicture?: {
    requestWindow: (options?: {
      width?: number;
      height?: number;
      preferInitialWindowPlacement?: boolean;
    }) => Promise<Window>;
  };
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function FocusClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const rawTime = searchParams.get("time");
  const taskTitle = searchParams.get("task") || "Your focus task";
  const taskId = searchParams.get("taskId");

  const pipWindowRef = useRef<Window | null>(null);
  const completionSavedRef = useRef(false);

  const durationMinutes = useMemo(() => {
    const parsedTime = Number(rawTime);

    if (!Number.isFinite(parsedTime) || parsedTime <= 0) {
      return 25;
    }

    if (parsedTime > 180) {
      return 25;
    }

    return parsedTime;
  }, [rawTime]);

  const totalSeconds = durationMinutes * 60;

  const [seconds, setSeconds] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [savingCompletion, setSavingCompletion] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [saveError, setSaveError] = useState("");

  const progress = useMemo(() => {
    const completedSeconds = totalSeconds - seconds;
    return Math.min(100, Math.max(0, (completedSeconds / totalSeconds) * 100));
  }, [seconds, totalSeconds]);

  const saveCompletedSession = useCallback(async () => {
    if (completionSavedRef.current) return;
    if (!user) return;

    try {
      completionSavedRef.current = true;
      setSavingCompletion(true);
      setSaveError("");

      if (taskId) {
        await updateDoc(doc(db, "tasks", taskId), {
          completed: true,
          status: "completed",
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await addDoc(collection(db, "focusSessions"), {
        userId: user.uid,
        taskId: taskId || null,
        taskTitle,
        durationMinutes,
        completed: true,
        createdAt: serverTimestamp(),
        completedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving completed session:", error);
      completionSavedRef.current = false;
      setSaveError(
        "Your session finished, but we couldn’t save it. Please try again."
      );
    } finally {
      setSavingCompletion(false);
    }
  }, [durationMinutes, taskId, taskTitle, user]);

  useEffect(() => {
    if (!running || completed) return;

    const timer = setInterval(() => {
      setSeconds((previousSeconds) => {
        if (previousSeconds <= 1) {
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, completed]);

  useEffect(() => {
    if (seconds === 0 && !completed) {
      setRunning(false);
      setCompleted(true);
      saveCompletedSession();
    }
  }, [seconds, completed, saveCompletedSession]);

  useEffect(() => {
    const pipWindow = pipWindowRef.current;

    if (!pipWindow || pipWindow.closed) return;

    const timeElement = pipWindow.document.getElementById("mini-time");
    const toggleButton = pipWindow.document.getElementById(
      "mini-toggle"
    ) as HTMLButtonElement | null;
    const statusElement = pipWindow.document.getElementById("mini-status");

    if (timeElement) {
      timeElement.textContent = formatTime(seconds);
    }

    if (toggleButton) {
      toggleButton.textContent = running ? "Pause" : "Resume";
      toggleButton.disabled = completed;
    }

    if (statusElement) {
      statusElement.textContent = completed
        ? "Session complete."
        : running
        ? "Timer is running."
        : "Timer is paused.";
    }
  }, [seconds, running, completed]);

  useEffect(() => {
    return () => {
      const pipWindow = pipWindowRef.current;

      if (pipWindow && !pipWindow.closed) {
        pipWindow.close();
      }
    };
  }, []);

  const handlePauseResume = () => {
    setRunning((current) => !current);
  };

  const handleReset = () => {
    setSeconds(totalSeconds);
    setRunning(false);
    setCompleted(false);
    setSaveError("");
  };

  const handleEndSession = async () => {
    try {
      setEndingSession(true);

      const pipWindow = pipWindowRef.current;

      if (pipWindow && !pipWindow.closed) {
        pipWindow.close();
      }

      if (taskId) {
        await updateDoc(doc(db, "tasks", taskId), {
          status: "ended",
          endedAt: serverTimestamp(),
          remainingSeconds: seconds,
          updatedAt: serverTimestamp(),
        });
      }

      router.replace("/dashboard");
    } catch (error) {
      console.error("Error ending session:", error);
      router.replace("/dashboard");
    } finally {
      setEndingSession(false);
    }
  };

  const handleStartAnotherSession = () => {
    router.replace("/mood");
  };

  const handleFinishToday = () => {
    router.replace("/dashboard");
  };

  const openMiniTimer = async () => {
    try {
      const existingWindow = pipWindowRef.current;

      if (existingWindow && !existingWindow.closed) {
        existingWindow.focus();
        return;
      }

      const currentWindow = window as WindowWithDocumentPictureInPicture;

      if (!currentWindow.documentPictureInPicture) {
        alert("Mini timer is not supported in this browser. Try Chrome or Edge.");
        return;
      }

      const pipWindow =
        await currentWindow.documentPictureInPicture.requestWindow({
          width: 320,
          height: 270,
          preferInitialWindowPlacement: false,
        });

      pipWindowRef.current = pipWindow;

      pipWindow.document.body.innerHTML = `
        <main class="mini-timer">
          <p class="label">ONESTEP</p>

          <h1 id="mini-time">${formatTime(seconds)}</h1>

          <p id="mini-status">
            ${
              completed
                ? "Session complete."
                : running
                ? "Timer is running."
                : "Timer is paused."
            }
          </p>

          <p id="mini-task">${taskTitle || "Focus session"}</p>

          <div class="controls">
            <button id="mini-toggle" ${completed ? "disabled" : ""}>
              ${running ? "Pause" : "Resume"}
            </button>

            <button id="mini-reset">
              Reset
            </button>

            <button id="mini-end">
              End
            </button>
          </div>
        </main>
      `;

      const style = pipWindow.document.createElement("style");

      style.textContent = `
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: linear-gradient(180deg, #020617, #0f172a, #020617);
          color: white;
          font-family: Arial, sans-serif;
        }

        .mini-timer {
          width: 100%;
          min-height: 100vh;
          padding: 22px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .label {
          margin: 0 0 12px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.35em;
        }

        h1 {
          margin: 0;
          font-size: 48px;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        #mini-status {
          margin: 10px 0 0;
          color: #94a3b8;
          font-size: 13px;
        }

        #mini-task {
          margin: 12px auto 20px;
          max-width: 250px;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.5;
        }

        .controls {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          border: 0;
          border-radius: 12px;
          padding: 10px 14px;
          background: #2563eb;
          color: white;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        button:hover {
          background: #1d4ed8;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        #mini-reset {
          background: #0f172a;
          border: 1px solid #334155;
          color: #cbd5e1;
        }

        #mini-reset:hover {
          background: #1e293b;
        }

        #mini-end {
          background: #334155;
        }

        #mini-end:hover {
          background: #475569;
        }
      `;

      pipWindow.document.head.appendChild(style);

      pipWindow.document
        .getElementById("mini-toggle")
        ?.addEventListener("click", () => {
          setRunning((current) => !current);
        });

      pipWindow.document
        .getElementById("mini-reset")
        ?.addEventListener("click", () => {
          setRunning(false);
          setSeconds(totalSeconds);
          setCompleted(false);
          setSaveError("");
        });

      pipWindow.document
        .getElementById("mini-end")
        ?.addEventListener("click", () => {
          handleEndSession();
        });

      pipWindow.addEventListener("pagehide", () => {
        pipWindowRef.current = null;
      });
    } catch (error) {
      console.error("Error opening mini timer:", error);
      alert("Could not open the mini timer. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-gradient-to-b
          from-slate-950
          via-slate-900
          to-slate-950
          px-4
          py-10
          text-white
        "
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center">
          <div className="w-full">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                Focus Session
              </p>

              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Focus gently.
              </h1>

              <p className="mx-auto max-w-xl text-slate-400">
                Stay with one task. No pressure to be perfect — just keep coming
                back to the next moment.
              </p>
            </div>

            <div
              className="
                rounded-3xl
                border
                border-slate-800
                bg-slate-900/70
                p-6
                text-center
                shadow-2xl
                backdrop-blur-xl
                md:p-8
              "
            >
              <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Current Task
                </p>

                <h2 className="text-xl font-semibold text-white">
                  {taskTitle}
                </h2>
              </div>

              <div className="mx-auto mb-8 max-w-md">
                <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                  <span>{durationMinutes} min session</span>
                  <span>{Math.round(progress)}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mb-8">
                <p className="text-7xl font-bold tracking-tight text-white md:text-8xl">
                  {formatTime(seconds)}
                </p>

                <p className="mt-3 text-sm text-slate-400">
                  {completed
                    ? "Session complete."
                    : running
                    ? "Timer is running."
                    : "Timer is paused."}
                </p>
              </div>

              {saveError && (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {saveError}
                </div>
              )}

              {!completed && (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                  <button
                    type="button"
                    onClick={handlePauseResume}
                    disabled={authLoading || endingSession}
                    className="
                      rounded-xl
                      bg-blue-500
                      px-6
                      py-3
                      font-medium
                      text-white
                      transition
                      hover:bg-blue-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {running ? "Pause" : "Resume"}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={authLoading || endingSession}
                    className="
                      rounded-xl
                      border
                      border-slate-700
                      px-6
                      py-3
                      font-medium
                      text-slate-300
                      transition
                      hover:border-slate-600
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={openMiniTimer}
                    disabled={authLoading || endingSession}
                    className="
                      rounded-xl
                      border
                      border-blue-500/30
                      px-6
                      py-3
                      font-medium
                      text-blue-300
                      transition
                      hover:bg-blue-500/10
                      hover:text-blue-200
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Mini Timer
                  </button>

                  <button
                    type="button"
                    onClick={handleEndSession}
                    disabled={authLoading || endingSession}
                    className="
                      rounded-xl
                      border
                      border-slate-800
                      px-6
                      py-3
                      font-medium
                      text-slate-400
                      transition
                      hover:border-slate-700
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {endingSession ? "Ending..." : "End Session"}
                  </button>
                </div>
              )}

              {completed && (
                <div className="space-y-6">
                  <div
                    className="
                      rounded-2xl
                      border
                      border-emerald-500/20
                      bg-emerald-500/10
                      p-6
                    "
                  >
                    <h2 className="mb-2 text-3xl font-semibold text-white">
                      🌱 Well done.
                    </h2>

                    <p className="text-slate-300">
                      You showed up and stayed with one task.
                    </p>

                    {savingCompletion && (
                      <p className="mt-3 text-sm text-slate-400">
                        Saving your session...
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={handleStartAnotherSession}
                      disabled={savingCompletion}
                      className="
                        rounded-xl
                        bg-blue-500
                        px-6
                        py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Start Another Session
                    </button>

                    <button
                      type="button"
                      onClick={handleFinishToday}
                      disabled={savingCompletion}
                      className="
                        rounded-xl
                        border
                        border-slate-700
                        px-6
                        py-3
                        font-medium
                        text-slate-300
                        transition
                        hover:border-slate-600
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Finish For Today
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </ProtectedRoute>
  );
}