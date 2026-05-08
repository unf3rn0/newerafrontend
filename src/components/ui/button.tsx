import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  ghost: "bg-transparent text-foreground hover:bg-surface-strong",
  outline:
    "border border-border bg-white text-foreground hover:border-primary/40 hover:bg-surface-strong",
  primary: "bg-primary text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/90",
  secondary: "bg-surface-strong text-accent-foreground hover:bg-accent/45",
};

const sizes: Record<ButtonSize, string> = {
  icon: "h-10 w-10 p-0",
  lg: "h-12 px-6 text-sm",
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-xs",
};

export function Button({
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
