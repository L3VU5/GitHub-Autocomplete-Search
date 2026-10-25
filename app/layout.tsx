import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "GitHub Autocomplete Search",
  description: "Search GitHub users and repositories as you type.",
};

export const viewport: Viewport = {
  themeColor: "#0b0709",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
          <div className="aurora left-1/2 top-[-12rem] h-[28rem] w-[56rem] -translate-x-1/2 bg-brand-600/35" />
          <div className="aurora bottom-[-10rem] right-[-8rem] h-[26rem] w-[30rem] bg-orange-600/20 [animation-delay:-10s]" />
        </div>
        {children}
      </body>
    </html>
  );
}
