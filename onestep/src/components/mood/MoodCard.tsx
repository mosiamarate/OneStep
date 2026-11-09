import type { MoodOption } from "../../constants/moods";
import MoodIcon from "../ui/MoodIcon";

interface MoodCardProps {
  mood: MoodOption;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export default function MoodCard({
  mood,
  selected,
  onSelect,
  disabled = false,
}: MoodCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`
        group
        rounded-2xl
        border
        p-5
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
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/10 text-blue-300">
          <MoodIcon mood={mood.id} size={26} />
        </span>

        <span
          className={`
            h-3 w-3 rounded-full border
            ${
              selected
                ? "border-blue-400 bg-blue-400"
                : "border-slate-600 bg-transparent"
            }
          `}
        />
      </div>

      <h3 className="mb-1 text-lg font-semibold text-white">
        {mood.label}
      </h3>

      <p className="text-sm leading-relaxed text-slate-400">
        {mood.description}
      </p>
    </button>
  );
}