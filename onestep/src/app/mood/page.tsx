"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import ProtectedRoute from "../../components/auth/ProtectedRoute";
import MoodCard from "../../components/mood/MoodCard";
import Button from "../../components/ui/Button";

import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import { moods, type MoodId } from "../../constants/moods";

import Footer from "../../components/layout/Footer";

export default function MoodPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [selectedMood, setSelectedMood] = useState<MoodId | "">("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const canContinue = selectedMood || note.trim().length > 0;

  const selectedMoodData = useMemo(() => {
    return moods.find((mood) => mood.id === selectedMood);
  }, [selectedMood]);

  const saveMood = async () => {
    setError("");

    if (!user) {
      setError("You need to be logged in to save your check-in.");
      return;
    }

    if (!selectedMood && !note.trim()) {
      setError("Please choose how you are feeling or write a short note.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "moods"), {
      userId: user.uid,
      mood: selectedMood || "custom",
      moodLabel: selectedMoodData?.label || "Custom reflection",
      note: note.trim(),
      createdAt: serverTimestamp(),
    });

      router.push("/task");
    } catch (error) {
      console.error("Error saving mood:", error);
      setError("We couldn’t save your check-in. Please try again.");
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

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center">
          <div className="w-full">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
                Daily Check-In
              </p>

              <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                How are you feeling today?
              </h1>

              <p className="mx-auto max-w-xl text-slate-400">
                No pressure. Take a moment to notice where you are emotionally
                before choosing one task.
              </p>
            </div>

            {error && (
              <div
                className="
                  mx-auto
                  mb-6
                  max-w-2xl
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

            <div className="grid gap-4 md:grid-cols-2">
              {moods.map((mood) => (
                <MoodCard
                  key={mood.id}
                  mood={mood}
                  selected={selectedMood === mood.id}
                  onSelect={() => setSelectedMood(mood.id)}
                  disabled={saving || authLoading}
                />
              ))}
            </div>

            {selectedMoodData && (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-blue-500/20
                  bg-blue-500/10
                  p-5
                  text-center
                "
              >
                <p className="text-sm leading-relaxed text-blue-100">
                  {selectedMoodData.response}
                </p>
              </div>
            )}

            <div className="mt-6">
              <label
                htmlFor="mood-note"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Add a short note{" "}
                <span className="font-normal text-slate-500">
                  optional
                </span>
              </label>

              <textarea
                id="mood-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={saving || authLoading}
                maxLength={220}
                placeholder="Example: I feel tired, but I want to do one small thing today."
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

              <div className="mt-2 flex justify-end">
                <p className="text-xs text-slate-500">
                  {note.length}/220
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <div className="w-full sm:w-64">
                <Button
                  type="button"
                  onClick={saveMood}
                  disabled={!canContinue || saving || authLoading}
                >
                  {saving ? "Saving..." : "Continue"}
              </Button>
              </div>

              <button
                type="button"
                onClick={() => router.push("/task")}
                disabled={saving || authLoading}
                className="
                  rounded-xl
                  px-6
                  py-3
                  text-sm
                  font-medium
                  text-slate-400
                  transition
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Skip for now
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </ProtectedRoute>
  );
}