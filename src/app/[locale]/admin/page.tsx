import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminDashboardData } from "@/lib/admin/db";
import { isLocale, type Locale } from "@/lib/i18n/config";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ params, searchParams }: AdminPageProps) {
  const [{ locale: localeParam }, rawSearchParams] = await Promise.all([params, searchParams]);

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  await requireAdmin(locale);

  const data = await getAdminDashboardData();
  const status = typeof rawSearchParams.status === "string" ? rawSearchParams.status : undefined;

  return <AdminDashboard data={data} locale={locale} status={status} />;
}
