import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";

type LegalPageProps = {
  params: Promise<{ locale: string }>;
};

const copy = {
  en: {
    body: [
      "NewEra sells its own clothing only. Product availability, delivery timing, and final order confirmation are handled by the brand team.",
      "Payment is manual through the QR code shown after checkout. If the customer does not press “I paid”, the order remains unpaid.",
      "After payment, the customer should contact NewEra through Instagram or phone to confirm the order.",
    ],
    title: "Terms of use",
  },
  ru: {
    body: [
      "NewEra продаёт только одежду собственного бренда. Наличие товаров, сроки доставки и финальное подтверждение заказа обрабатываются командой бренда.",
      "Оплата выполняется вручную через QR-код, который показывается после checkout. Если покупатель не нажал “Я оплатил”, заказ остаётся неоплаченным.",
      "После оплаты покупателю нужно связаться с NewEra через Instagram или телефон для подтверждения заказа.",
    ],
    title: "Пользовательское соглашение",
  },
  tg: {
    body: [
      "NewEra танҳо либоси бренди худро мефурӯшад. Дастрасии мол, вақти доставка ва тасдиқи ниҳоии фармоиш аз ҷониби дастаи бренд коркард мешавад.",
      "Пардохт дастӣ тавассути QR-код анҷом мешавад. Агар харидор “Ман пардохт кардам”-ро пахш накунад, фармоиш нопардохт мемонад.",
      "Пас аз пардохт харидор бояд барои тасдиқи фармоиш тавассути Instagram ё телефон бо NewEra тамос гирад.",
    ],
    title: "Шартҳои истифода",
  },
} satisfies Record<Locale, { body: string[]; title: string }>;

export default async function TermsPage({ params }: LegalPageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const dictionary = await getDictionary(locale);
  const pageCopy = copy[locale];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm font-semibold uppercase text-primary">{dictionary.common.brand}</p>
      <h1 className="mt-4 text-4xl font-semibold leading-tight">{pageCopy.title}</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-muted-foreground">
        {pageCopy.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
