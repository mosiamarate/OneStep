"use client";

import { MAX_FOCUS_MINUTES } from "../../constants/focus";

const presets = [
  { minutes: 10, label: "10 min" },
  { minutes: 25, label: "25 min" },
  { minutes: 45, label: "45 min" },
  { minutes: 90, label: "1 hr 30" },
];

interface TimeSelectorProps {
  selectedTime: number;
  onSelect: (minutes: number) => void;
  disabled?: boolean;
}

function toParts(totalMinutes: number) {
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

function formatDuration(totalMinutes: number) {
  const { hours, minutes } = toParts(totalMinutes);
  if (!hours) return `${minutes} minutes`;
  if (!minutes) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return `${hours}h ${minutes}m`;
}

export default function TimeSelector({
  selectedTime,
  onSelect,
  disabled = false,
}: TimeSelectorProps) {
  const { hours, minutes } = toParts(selectedTime);

  const selectParts = (nextHours: number, nextMinutes: number) => {
    const total = Math.min(
      MAX_FOCUS_MINUTES,
      Math.max(1, nextHours * 60 + nextMinutes)
    );
    onSelect(total);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" aria-label="Focus time presets">
        {presets.map((preset) => (
          <button
            key={preset.minutes}
            type="button"
            disabled={disabled}
            aria-pressed={selectedTime === preset.minutes}
            onClick={() => selectParts(...Object.values(toParts(preset.minutes)) as [number, number])}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
              selectedTime === preset.minutes
                ? "border-blue-500 bg-blue-500/15 text-blue-200"
                : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-300">Set a duration</p>
            <p className="mt-1 text-xs text-slate-500">Scroll or use the fields. Up to 24 hours.</p>
          </div>
          <p className="text-right text-lg font-semibold text-white" aria-live="polite">
            {formatDuration(selectedTime)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Hours
            <select
              aria-label="Focus hours"
              value={hours}
              disabled={disabled}
              onChange={(event) => selectParts(Number(event.target.value), minutes)}
              className="mt-2 block h-28 w-full snap-y snap-mandatory overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 px-3 text-center text-3xl font-semibold text-white outline-none focus:border-blue-500"
            >
              {Array.from({ length: 25 }, (_, hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </label>

          <label className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Minutes
            <select
              aria-label="Focus minutes"
              value={minutes}
              disabled={disabled}
              onChange={(event) => selectParts(hours, Number(event.target.value))}
              className="mt-2 block h-28 w-full snap-y snap-mandatory overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 px-3 text-center text-3xl font-semibold text-white outline-none focus:border-blue-500"
            >
              {Array.from({ length: 60 }, (_, minute) => (
                <option key={minute} value={minute}>
                  {minute.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block text-sm text-slate-400">
          Exact minutes
          <input
            type="number"
            min={1}
            max={MAX_FOCUS_MINUTES}
            value={selectedTime}
            disabled={disabled}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isFinite(value) && value >= 1 && value <= MAX_FOCUS_MINUTES) {
                onSelect(Math.round(value));
              }
            }}
            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>
      </div>
    </div>
  );
}
