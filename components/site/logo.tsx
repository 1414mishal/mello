import { cn } from "@/lib/utils";

export function Logo({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <a
      href="#top"
      className={cn(
        "group inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight",
        invert ? "text-white" : "text-ink",
        className,
      )}
      aria-label="mello agency — home"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 group-hover:-rotate-6"
      >
        <path
          d="M6 20c0-7.732 6.268-14 14-14 .35 0 .68.14.93.39.24.25.38.59.38.94 0 7.18-5.82 13-13 13a1.3 1.3 0 0 1-1.31-1.31Z"
          fill={invert ? "#ffffff" : "#0a0a0a"}
        />
        <path
          d="M4 12c0 6.075 4.925 11 11 11 .55 0 1-.45 1-1 0-6.075-4.925-11-11-11-.55 0-1 .45-1 1Z"
          fill={invert ? "#ffffff" : "#0a0a0a"}
          fillOpacity="0.55"
        />
      </svg>
      <span>
        mello<span className="font-light italic">agency</span>
      </span>
    </a>
  );
}
