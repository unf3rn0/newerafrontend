import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothWheelScroll } from "@/components/motion/smooth-wheel-scroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "NewEra",
  title: {
    default: "NewEra",
    template: "%s | NewEra",
  },
  description: "NewEra premium clothing house with manual QR payment and curated fashion catalog.",
  icons: {
    apple: "/assets/favicon.ico",
    icon: [{ url: "/favicon.ico" }, { url: "/assets/favicon.ico" }],
    shortcut: "/assets/favicon.ico",
  },
  keywords: ["NewEra", "premium clothing", "fashion", "Tajikistan", "QR payment"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    description: "Own-brand premium clothing e-commerce with manual QR-payment confirmation.",
    images: [{ alt: "NewEra", url: "/assets/logo.png" }],
    siteName: "NewEra",
    title: "NewEra",
    type: "website",
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: "summary_large_image",
    description: "Own-brand premium clothing e-commerce with manual QR-payment confirmation.",
    images: ["/assets/logo.png"],
    title: "NewEra",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <SmoothWheelScroll />
        {children}
      </body>
    </html>
  );
}
