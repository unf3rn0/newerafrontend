import { LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";

type RegisterFormProps = {
  action: (formData: FormData) => Promise<void>;
  dictionary: Dictionary;
  error: "exists" | "invalid" | "rate" | null;
  locale: Locale;
  nextPath: string | null;
};

function authPath(locale: Locale, path: "/login" | "/register", nextPath: string | null) {
  return localizedPath(locale, nextPath ? `${path}?next=${encodeURIComponent(nextPath)}` : path);
}

export function RegisterForm({ action, dictionary, error, locale, nextPath }: RegisterFormProps) {
  const errorMessage =
    error === "exists"
      ? dictionary.auth.accountExists
      : error === "invalid"
        ? dictionary.auth.registrationInvalid
        : error === "rate"
          ? dictionary.auth.rateLimited
          : null;

  return (
    <form
      action={action}
      className="rounded-lg border border-border bg-white p-5 shadow-sm shadow-primary/5"
    >
      {nextPath ? <input name="next" type="hidden" value={nextPath} /> : null}

      <div>
        <h1 className="text-3xl font-semibold leading-tight">{dictionary.auth.registerTitle}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {dictionary.auth.registerSubtitle}
        </p>
      </div>

      {errorMessage ? (
        <div className="mt-5 rounded-lg border border-warning/25 bg-[#fff7ed] px-4 py-3 text-sm font-medium text-warning">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <label className="block space-y-2 text-sm font-medium">
          <span>{dictionary.auth.email}</span>
          <span className="relative block">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              autoComplete="email"
              className="pl-10"
              name="email"
              placeholder={dictionary.auth.emailPlaceholder}
              required
              type="email"
            />
          </span>
        </label>

        <label className="block space-y-2 text-sm font-medium">
          <span>{dictionary.auth.loginField}</span>
          <span className="relative block">
            <UserRound
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              autoComplete="username"
              className="pl-10"
              name="login"
              placeholder={dictionary.auth.loginPlaceholder}
              required
            />
          </span>
        </label>

        <label className="block space-y-2 text-sm font-medium">
          <span>{dictionary.auth.password}</span>
          <span className="relative block">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              autoComplete="new-password"
              className="pl-10"
              name="password"
              placeholder={dictionary.auth.passwordPlaceholder}
              required
              type="password"
            />
          </span>
        </label>
      </div>

      <Button className="mt-6 w-full" type="submit">
        {dictionary.auth.registerSubmit}
      </Button>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {dictionary.auth.hasAccount}{" "}
        <Link
          className="font-semibold text-primary transition hover:text-accent-foreground"
          href={authPath(locale, "/login", nextPath)}
        >
          {dictionary.auth.loginLink}
        </Link>
      </p>
    </form>
  );
}
