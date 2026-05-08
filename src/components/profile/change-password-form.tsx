"use client";

import { CheckCircle2, LockKeyhole, X } from "lucide-react";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChangePasswordState } from "@/app/[locale]/profile/actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type ChangePasswordFormProps = {
  action: (state: ChangePasswordState, formData: FormData) => Promise<ChangePasswordState>;
  dictionary: Dictionary;
};

const initialState: ChangePasswordState = { status: "idle" };

function SubmitButton({ dictionary }: { dictionary: Dictionary }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full sm:w-auto sm:min-w-52" disabled={pending} type="submit">
      <LockKeyhole aria-hidden="true" className="h-4 w-4" />
      {pending ? dictionary.auth.changePasswordSaving : dictionary.auth.changePasswordSubmit}
    </Button>
  );
}

function ChangePasswordDialog({
  action,
  dictionary,
  onClose,
}: ChangePasswordFormProps & {
  onClose: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const errorMessage =
    state.status === "error"
      ? state.error === "current"
        ? dictionary.auth.changePasswordCurrentInvalid
        : state.error === "same"
          ? dictionary.auth.changePasswordSame
          : state.error === "auth"
            ? dictionary.auth.changePasswordAuthRequired
            : dictionary.auth.changePasswordInvalid
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 px-4 py-6 backdrop-blur-sm">
      <div
        aria-labelledby="change-password-title"
        aria-modal="true"
        className="w-full max-w-2xl rounded-lg border border-border bg-white p-5 shadow-xl shadow-primary/10"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold" id="change-password-title">
              {dictionary.auth.changePasswordTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {dictionary.auth.changePasswordSubtitle}
            </p>
          </div>
          <button
            aria-label={dictionary.auth.closeDialog}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-primary/40 hover:bg-surface-strong hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <form action={formAction} className="mt-6" ref={formRef}>
          {state.status === "success" ? (
            <div className="flex items-start gap-2 rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{dictionary.auth.changePasswordSuccess}</span>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-lg border border-warning/25 bg-[#fff7ed] px-4 py-3 text-sm font-medium text-warning">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-5 grid gap-4">
            <label className="block space-y-2 text-sm font-medium">
              <span>{dictionary.auth.currentPassword}</span>
              <Input
                autoComplete="current-password"
                name="currentPassword"
                required
                type="password"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm font-medium">
                <span>{dictionary.auth.newPassword}</span>
                <Input autoComplete="new-password" name="newPassword" required type="password" />
              </label>
              <label className="block space-y-2 text-sm font-medium">
                <span>{dictionary.auth.confirmNewPassword}</span>
                <Input
                  autoComplete="new-password"
                  name="confirmPassword"
                  required
                  type="password"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={onClose} type="button" variant="outline">
              {dictionary.auth.closeDialog}
            </Button>
            <SubmitButton dictionary={dictionary} />
          </div>
        </form>
      </div>
    </div>
  );
}

export function ChangePasswordForm({ action, dictionary }: ChangePasswordFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  return (
    <div className="h-full">
      <div className="flex h-full min-h-24 flex-col justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3 shadow-sm shadow-primary/5">
        <div>
          <p className="font-medium text-foreground">{dictionary.auth.changePasswordTitle}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {dictionary.auth.changePasswordSubtitle}
          </p>
        </div>
        <Button className="w-full sm:w-fit" onClick={() => setIsOpen(true)} type="button">
          <LockKeyhole aria-hidden="true" className="h-4 w-4" />
          {dictionary.auth.changePasswordSubmit}
        </Button>
      </div>

      {isOpen ? (
        <ChangePasswordDialog action={action} dictionary={dictionary} onClose={closeDialog} />
      ) : null}
    </div>
  );
}
