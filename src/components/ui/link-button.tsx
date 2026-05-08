import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "outline";
};

const variants = {
  ghost: "bg-transparent text-foreground hover:bg-surface-strong",
  outline:
    "border border-border bg-white text-foreground hover:border-primary/40 hover:bg-surface-strong",
  primary: "bg-primary text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/90",
  secondary: "bg-surface-strong text-accent-foreground hover:bg-accent/45",
};

const sizes = {
  lg: "h-12 px-6 text-sm",
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-xs",
};

export function LinkButton({
  children,
  className,
  href,
  size = "md",
  variant = "primary",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/25",
        variants[variant],
        sizes[size],
        className,
      )}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
