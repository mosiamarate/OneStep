"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Button from "../../components/ui/Button";
import TimeSelector from "../../components/task/TimeSelector";

import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";

import { FirebaseError } from "firebase/app";

import Footer from "../../components/layout/Footer";

export default function TaskPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [task, setTask] = useState("");
  const [selectedTime, setSelectedTime] = useState(25);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleStartFocus = async () => {
    setError("");

    const trimmedTask = task.trim();

    if (!user) {
      setError("You need to be logged in to start a focus session.");
      return;
    }

    if (!trimmedTask) {
      setError("Please enter one small task to focus on.");
      return;
    }

    if (trimmedTask.length < 3) {
      setError("Your task is too short. Add a little more detail.");
      return;
    }

    if (selectedTime < 1 || selectedTime > 180) {
      setError("Please choose a focus time between 1 and 180 minutes.");
      return;
    }

    try {
      setSaving(true);

      const taskRef = await addDoc(collection(db, "tasks"), {
        userId: user.uid,
        title: trimmedTask,
        durationMinutes: selectedTime,
        completed: false,
        status: "active",
        createdAt: serverTimestamp(),
      });

      router.push(
        `/focus?time=${selectedTime}&task=${encodeURIComponent(
          trimmedTask
        )}&taskId=${taskRef.id}`
      );
    } catch (error) {
      console.error("Error creating task:", error);

      if (error instanceof FirebaseError) {
        setError(`Firebase error: ${error.code}`);
      } else {
        setError("We couldn’t start your focus session. Please try again.");
      }
    } finally {
      setSaving(false);
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
                One Task
              </p>

              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                What’s one small task you want to focus on?
              </h1>

              <p className="mx-auto max-w-xl text-slate-400">
                Keep it simple. You don’t need to plan your whole day — just
                choose the next gentle step.
              </p>
            </div>

            <div
              className="
                rounded-3xl
                border
                border-slate-800
                bg-slate-900/70
                p-6
                shadow-2xl
                backdrop-blur-xl
                md:p-8
              "
            >
              {error && (
                <div
                  className="
                    mb-5
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-4
                    py-3
                    text-sm
                    text-red-400
                  "
                >
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="task"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Your focus task
                  </label>

                  <textarea
                    id="task"
                    value={task}
                    onChange={(event) => setTask(event.target.value)}
                    disabled={saving || authLoading}
                    maxLength={100}
                    placeholder="Example: Study networking notes for 25 minutes"
                    className="
                      min-h-28
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      border-slate-800
                      bg-slate-950/50
                      px-4
                      py-4
                      text-white
                      outline-none
                      placeholder:text-slate-600
                      transition
                      focus:border-blue-500
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <div className="mt-2 flex justify-between gap-4">
                    <p className="text-xs text-slate-500">
                      Make it clear and small.
                    </p>

                    <p className="text-xs text-slate-500">
                      {task.length}/100
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-white">
                      Choose your focus time
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Pick what feels realistic for your current energy.
                    </p>
                  </div>

                  <TimeSelector
                    selectedTime={selectedTime}
                    onSelect={setSelectedTime}
                    disabled={saving || authLoading}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={handleStartFocus}
                    disabled={!task.trim() || saving || authLoading}
                  >
                    {saving ? "Starting..." : "Start Focus Session"}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    disabled={saving || authLoading}
                    className="
                      text-sm
                      font-medium
                      text-slate-400
                      transition
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </ProtectedRoute>
  );
}