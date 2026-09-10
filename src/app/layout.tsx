import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import MainShell from "@/components/MainShell";
import ThemeProvider from "@/components/ThemeProvider";
import { ModeProvider } from "@/components/ModeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});export const metadata: Metadata = {
  title: "Devvrat Hans - Software Engineer & Builder",
  description:
    "Portfolio of Devvrat Hans - B.Tech CSE at IIT Gandhinagar. Software engineer, open-source contributor, and builder of things that matter.",
  keywords: [
    "Devvrat Hans",
    "portfolio",
    "software engineer",
    "IIT Gandhinagar",
    "full stack developer",
    "Next.js",
    "Rust",
    "TypeScript",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Devvrat Hans - Software Engineer & Builder",
    description: "Portfolio of Devvrat Hans - B.Tech CSE at IIT Gandhinagar.",
    url: "https://devvrathans.com",
    siteName: "Devvrat Hans",
    type: "website",
    images: ["/profile.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devvrat Hans - Software Engineer & Builder",
    description: "Portfolio of Devvrat Hans - B.Tech CSE at IIT Gandhinagar.",
    images: ["/profile.jpg"],
  },
};


export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-body">
        <ThemeProvider>
          <ModeProvider>
            <Nav />
            <MainShell>{children}</MainShell>
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
