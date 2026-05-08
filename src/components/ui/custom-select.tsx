"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CustomSelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  ariaLabel?: string;
  className?: string;
  defaultValue?: string;
  name: string;
  options: CustomSelectOption[];
};

export function CustomSelect({
  ariaLabel,
  className,
  defaultValue,
  name,
  options,
}: CustomSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <input name={name} readOnly type="hidden" value={selectedOption?.value ?? ""} />
      <button
        aria-controls={id}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-border bg-white px-3 text-left text-sm text-foreground shadow-sm shadow-primary/5 outline-none transition",
          "hover:border-primary/35 hover:bg-surface focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
        )}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition",
            isOpen && "rotate-180 text-primary",
          )}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-lg border border-border bg-white shadow-xl shadow-primary/15"
          id={id}
          role="listbox"
        >
          <div className="max-h-72 overflow-y-auto p-1">
            {options.map((option) => {
              const isSelected = option.value === selectedOption?.value;

              return (
                <button
                  aria-selected={isSelected}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm transition",
                    isSelected
                      ? "bg-surface-strong text-accent-foreground"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground",
                  )}
                  key={option.value}
                  onClick={() => {
                    setValue(option.value);
                    setIsOpen(false);
                  }}
                  role="option"
                  type="button"
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
