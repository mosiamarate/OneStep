"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
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

interface TimeSelectProps {
  label: string;
  value: number;
  options: number[];
  formatOption: (value: number) => string;
  onChange: (value: number) => void;
  disabled: boolean;
}

function TimeSelect({
  label,
  value,
  options,
  formatOption,
  onChange,
  disabled,
}: TimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeValue, setActiveValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document
      .getElementById(`${listboxId}-option-${activeValue}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeValue, isOpen, listboxId]);

  const open = () => {
    setActiveValue(value);
    setIsOpen(true);
  };

  const choose = (nextValue: number) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = options.indexOf(isOpen ? activeValue : value);
    let nextIndex = currentIndex;

    switch (event.key) {
      case "ArrowDown":
        nextIndex = Math.min(options.length - 1, currentIndex + 1);
        break;
      case "ArrowUp":
        nextIndex = Math.max(0, currentIndex - 1);
        break;
      case "PageDown":
        nextIndex = Math.min(options.length - 1, currentIndex + 10);
        break;
      case "PageUp":
        nextIndex = Math.max(0, currentIndex - 10);
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = options.length - 1;
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          choose(activeValue);
        } else {
          open();
        }
        return;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        return;
      default:
        return;
    }

    event.preventDefault();
    if (!isOpen) setIsOpen(true);
    setActiveValue(options[nextIndex]);
  };

  return (
    <div ref={containerRef} className="relative mt-2">
      <button
        type="button"
        aria-label={`Focus ${label.toLowerCase()}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen ? `${listboxId}-option-${activeValue}` : undefined
        }
        disabled={disabled}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onBlur={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !containerRef.current?.contains(event.relatedTarget)
          ) {
            setIsOpen(false);
          }
        }}
        onKeyDown={handleKeyDown}
        className="focus-time-select flex h-16 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-4 text-center text-white outline-none transition focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 sm:h-20"
      >
        <span>{formatOption(value)}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="absolute right-3 h-4 w-4 text-slate-300"
        >
          <path
            d="m6 8 4 4 4-4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      </button>
      <ul
        id={listboxId}
        role="listbox"
        aria-label={label}
        hidden={!isOpen}
        className="absolute bottom-full left-0 z-30 mb-2 max-h-[min(15rem,40dvh)] w-full overflow-y-auto overscroll-contain rounded-xl border border-slate-700 bg-slate-900 p-1 text-base shadow-xl"
      >
        {options.map((option) => (
          <li
            id={`${listboxId}-option-${option}`}
            key={option}
            role="option"
            aria-selected={option === value}
            className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-3 py-1 text-base font-normal leading-6 text-slate-100 ${
              option === activeValue
                ? "bg-blue-500/20 text-white"
                : "hover:bg-slate-800"
            }`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(option)}
          >
            {formatOption(option)}
          </li>
        ))}
      </ul>
    </div>
  );
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
          <div className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <span>Hours</span>
            <TimeSelect
              label="Hours"
              value={hours}
              options={Array.from({ length: 25 }, (_, hour) => hour)}
              formatOption={(hour) => String(hour)}
              disabled={disabled}
              onChange={(nextHours) => selectParts(nextHours, minutes)}
            />
          </div>

          <div className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <span>Minutes</span>
            <TimeSelect
              label="Minutes"
              value={minutes}
              options={Array.from({ length: 60 }, (_, minute) => minute)}
              formatOption={(minute) => minute.toString().padStart(2, "0")}
              disabled={disabled}
              onChange={(nextMinutes) => selectParts(hours, nextMinutes)}
            />
          </div>
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
