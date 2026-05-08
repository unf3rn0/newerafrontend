import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/navigation";

export default function AdminEntryPage() {
  redirect(localizedPath(defaultLocale, "/admin"));
}
