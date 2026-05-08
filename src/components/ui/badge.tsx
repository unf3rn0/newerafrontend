import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "blue" | "neutral" | "sale" | "success";

const tones: Record<BadgeTone, string> = {
  blue: "border-primary/15 bg-surface-strong text-accent-foreground",
  neutral: "border-border bg-white text-muted-foreground",
  sale: "border-warning/20 bg-[#fff7ed] text-warning",
  success: "border-success/20 bg-[#ecfdf5] text-success",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border px-3 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
