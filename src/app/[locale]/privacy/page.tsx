import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";

type LegalPageProps = {
  params: Promise<{ locale: string }>;
};

const copy = {
  en: {
    body: [
      "NewEra stores account, order, and delivery data only to process purchases and manual QR-payment confirmation.",
      "Passwords are stored as hashes. Payment card data is not collected because NewEra does not use external payment systems.",
      "For order confirmation, customers may contact NewEra through Instagram or phone.",
    ],
    title: "Privacy policy",
  },
  ru: {
    body: [
      "NewEra хранит данные аккаунта, заказа и доставки только для обработки покупок и ручного подтверждения оплаты по QR.",
      "Пароли хранятся в виде хеша. Данные банковских карт не собираются, потому что NewEra не использует внешние платёжные системы.",
      "Для подтверждения заказа покупатель может связаться с NewEra через Instagram или телефон.",
    ],
    title: "Политика конфиденциальности",
  },
  tg: {
    body: [
      "NewEra маълумоти аккаунт, фармоиш ва доставка-ро танҳо барои коркарди харид ва тасдиқи дастии пардохт бо QR нигоҳ медорад.",
      "Паролҳо ҳамчун hash нигоҳ дошта мешаванд. Маълумоти корт ҷамъоварӣ намешавад, зеро NewEra системаҳои пардохтии берунаро истифода намекунад.",
      "Барои тасдиқи фармоиш харидор метавонад тавассути Instagram ё телефон бо NewEra тамос гирад.",
    ],
    title: "Сиёсати махфият",
  },
} satisfies Record<Locale, { body: string[]; title: string }>;

export default async function PrivacyPage({ params }: LegalPageProps) {
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
