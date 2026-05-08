import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxFieldProps = {
  className?: string;
  defaultChecked?: boolean;
  label: ReactNode;
  name: string;
  value?: string;
};

export function CheckboxField({
  className,
  defaultChecked,
  label,
  name,
  value = "true",
}: CheckboxFieldProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground",
        className,
      )}
    >
      <input
        className="peer sr-only"
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
        value={value}
      />
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-md border border-border bg-white transition",
          "peer-checked:border-primary peer-checked:bg-primary peer-checked:[&>svg]:opacity-100",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20",
        )}
      >
        <Check aria-hidden="true" className="h-3.5 w-3.5 text-white opacity-0 transition" />
      </span>
      <span>{label}</span>
    </label>
  );
}
