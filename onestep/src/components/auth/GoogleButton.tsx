interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export default function GoogleButton({
  onClick,
  loading = false,
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="
        w-full
        py-3
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        hover:border-slate-600
        hover:bg-slate-800
        transition-all
        flex
        items-center
        justify-center
        gap-3
        text-white
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
      >
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 15 19 12 24 12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.8-3.3-11.5-8l-6.5 5C9.3 39.6 16.1 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-1 2.8-3 5.1-5.8 6.6l6.2 5.2C39.3 36.4 44 30.8 44 24c0-1.3-.1-2.4-.4-3.5z"
        />
      </svg>

      {loading ? "Connecting..." : "Continue with Google"}
    </button>
  );
}