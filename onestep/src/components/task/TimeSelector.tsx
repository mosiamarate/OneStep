"use client";

import { useState } from "react";

interface TimeOption {
  label: string;
  minutes: number;
  description: string;
}

const timeOptions: TimeOption[] = [
  {
    label: "10 min",
    minutes: 10,
    description: "Gentle start",
  },
  {
    label: "25 min",
    minutes: 25,
    description: "Balanced focus",
  },
  {
    label: "45 min",
    minutes: 45,
    description: "Deep work",
  },
];

interface TimeSelectorProps {
  selectedTime: number;
  onSelect: (minutes: number) => void;
  disabled?: boolean;
}

export default function TimeSelector({
  selectedTime,
  onSelect,
  disabled = false,
}: TimeSelectorProps) {
  const [customTime, setCustomTime] = useState("");

  const presetTimes = timeOptions.map((option) => option.minutes);
  const isCustomSelected =
    selectedTime > 0 && !presetTimes.includes(selectedTime);

  const handleCustomTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setCustomTime(value);

    const minutes = Number(value);

    if (!Number.isFinite(minutes)) return;

    if (minutes >= 1 && minutes <= 180) {
      onSelect(minutes);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {timeOptions.map((option) => {
          const selected = selectedTime === option.minutes;

          return (
            <button
              key={option.minutes}
              type="button"
              disabled={disabled}
              onClick={() => {
                setCustomTime("");
                onSelect(option.minutes);
              }}
              className={`
                rounded-2xl
                border
                p-4
                text-left
                transition-all
                duration-200
                disabled:cursor-not-allowed
                disabled:opacity-60
                hover:-translate-y-0.5

                ${
                  selected
                    ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                    : "border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900"
                }
              `}
            >
              <p className="text-lg font-semibold text-white">
                {option.label}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      <div
        className={`
          rounded-2xl
          border
          p-4
          transition-all
          duration-200

          ${
            isCustomSelected
              ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
              : "border-slate-800 bg-slate-900/70"
          }
        `}
      >
        <label
          htmlFor="custom-time"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Custom time
        </label>

        <div className="flex items-center gap-3">
          <input
            id="custom-time"
            type="number"
            min={1}
            max={180}
            value={customTime}
            onChange={handleCustomTimeChange}
            disabled={disabled}
            placeholder="Example: 15"
            className="
              w-full
              rounded-xl
              border
              border-slate-800
              bg-slate-950/50
              px-4
              py-3
              text-white
              outline-none
              placeholder:text-slate-600
              transition
              focus:border-blue-500
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <span className="whitespace-nowrap text-sm text-slate-400">
            minutes
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Choose any time between 1 and 180 minutes.
        </p>
      </div>
    </div>
  );
}