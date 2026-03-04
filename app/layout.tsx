import type { Metadata } from "next";
import { Manrope, Sora, Geist_Mono } from "next/font/google";
import "@xyflow/react/dist/style.css";
import "./globals.css";

const uiSans = Manrope({
  variable: "--font-ui-sans",
  subsets: ["latin"],
  display: "swap",
});

const displaySans = Sora({
  variable: "--font-display-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentes Matrix | UI Multiagente",
  description: "Interfaz web para sistema multiagente jerarquico con OpenClaw, n8n y Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${uiSans.variable} ${displaySans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
