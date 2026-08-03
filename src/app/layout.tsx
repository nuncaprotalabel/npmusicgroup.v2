import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NP Music Group — Plataforma para artistas independientes",
  description:
    "Distribuye tu música en todas las plataformas digitales, gestiona tu carrera y genera ingresos reales con herramientas profesionales diseñadas para artistas independientes.",
  keywords: [
    "distribución musical",
    "artistas independientes",
    "música digital",
    "streaming",
    "royalties",
    "NP Music Group",
  ],
  authors: [{ name: "NP Music Group" }],
  openGraph: {
    title: "NP Music Group — Tu música. Tu carrera. Tu negocio.",
    description:
      "Plataforma todo-en-uno para artistas independientes. Distribución global, ingresos transparentes y gestión profesional.",
    type: "website",
    locale: "es_ES",
    siteName: "NP Music Group",
  },
  twitter: {
    card: "summary_large_image",
    title: "NP Music Group",
    description: "Plataforma todo-en-uno para artistas independientes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
