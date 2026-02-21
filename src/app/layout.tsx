import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antitrust Library",
  description: "Biblioteca de pesquisa e consulta contínua de casos Antitrust",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${sourceSans.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Suspense fallback={<aside className="w-64 bg-gray-50/50 hidden md:block border-r border-light-gray h-full animate-pulse" />}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/30">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
