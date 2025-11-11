import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./providers/ThemeProvider";
import SessionProvider from "./providers/SessionProvider";
import Navbar from "./components/Navbar";
import BanCheckWrapper from "./components/BanCheckWrapper";
import ForcePasswordResetWrapper from "./components/ForcePasswordResetWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Tracker - Manage Your Finances",
  description: "A powerful budgeting app to track your income, expenses, and manage your financial goals with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 to-blue-50 dark:bg-gray-900 text-slate-900 dark:text-white transition-all duration-500`}
      >
        <SessionProvider>
          <ThemeProvider>
            <BanCheckWrapper>
              <ForcePasswordResetWrapper>
                <Navbar />
                {children}
              </ForcePasswordResetWrapper>
            </BanCheckWrapper>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
