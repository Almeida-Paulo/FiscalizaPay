import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootProviders } from "./providers";
import { AppShell } from "@/widgets/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FiscalizaPay Web3",
  description:
    "Plataforma de fiscalização e liberação segura de pagamentos em contratos públicos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="overflow-hidden" suppressHydrationWarning>
        <RootProviders>
          <AppShell>{children}</AppShell>
        </RootProviders>
      </body>
    </html>
  );
}
