import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationsProvider } from "@/lib/notifications-context";
import { JsonLd } from "@/components/JsonLd";
import { LocaleHtmlLang } from "@/components/LocaleHtmlLang";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import { SITE } from "@/lib/server-api";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // Plain string, deliberately no `template`: every page in this codebase
  // already composes its own full title including "${SITE.name}" — a
  // template here would double the brand name (e.g. "X | Gjej Pro | Gjej
  // Pro") on every one of them. This is only the fallback for the rare
  // page that doesn't set its own title at all.
  title: `${SITE.name} | Profesionistë për ju`,
  description: SITE.description,
  openGraph: {
    siteName: SITE.name,
    locale: "sq_AL",
    type: "website",
    images: [{ url: "/icon.png", width: 500, height: 250, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Profesionistë për ju`,
    description: SITE.description,
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={SITE.locale}
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <LocaleHtmlLang />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <AuthProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
