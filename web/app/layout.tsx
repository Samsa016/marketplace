import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import { Header } from "@/widgets/header/ui/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyMarket - FSD Next.js",
  description: "Marketplace built with Next.js, Zustand, and FSD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: '#f9fafb' }}>
        <Header />

        <div style={{ minHeight: 'calc(100vh - 70px)' }}>
            {children}
        </div>
      </body>
    </html>
  );
}