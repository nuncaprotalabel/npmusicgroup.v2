import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "./Providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "UPSI — Distribución musical global",
  description:
    "UPSI conecta proyectos musicales con plataformas de streaming mediante un proceso de acceso y revisión.",
  keywords: [
    "distribución musical",
    "artistas independientes",
    "música digital",
    "streaming",
    "royalties",
    "UPSI",
  ],
  authors: [{ name: "UPSI" }],
  openGraph: {
    title: "UPSI — Tu música, sin límites.",
    description:
      "Distribución musical digital para artistas y proyectos independientes.",
    type: "website",
    locale: "es_ES",
    siteName: "UPSI",
  },
  twitter: {
    card: "summary_large_image",
    title: "UPSI",
    description: "Distribución musical digital para artistas y proyectos independientes.",
  },
  icons: {
    icon: "/upsi-mark.webp",
    apple: "/upsi-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07060A",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get("np-language")?.value;
  const initialLanguage = savedLanguage === "en" ? "en" : "es";

  return (
    <html lang={initialLanguage} className={plusJakartaSans.variable}>
      <body className="antialiased">
        <Providers initialLanguage={initialLanguage}>{children}</Providers>
      </body>
    </html>
  );
}
