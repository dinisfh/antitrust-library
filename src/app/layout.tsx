import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SidebarWrapper from "@/components/SidebarWrapper";
import { Suspense } from 'react'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { cookies } from 'next/headers'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antitrust Case Library",
  description: "Biblioteca de pesquisa e consulta contínua de casos Antitrust",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('app-language')?.value;
  const initialLang = (langCookie === 'pt' || langCookie === 'en') ? langCookie : 'en';

  return (
    <html lang={initialLang} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${sourceSans.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <LanguageProvider initialLang={initialLang}>
          <Header />
          <SidebarWrapper
            sidebar={
              <Suspense fallback={<aside className="w-64 bg-gray-50/50 hidden md:block border-r border-light-gray h-full animate-pulse z-0" />}>
                <Sidebar />
              </Suspense>
            }
          >
            {children}
          </SidebarWrapper>
        </LanguageProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
