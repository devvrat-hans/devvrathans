import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import MainShell from "@/components/MainShell";
import ThemeProvider, { themeInitScript } from "@/components/ThemeProvider";
import { ModeProvider } from "@/components/ModeProvider";
import CommandPalette from "@/components/CommandPalette";
import Toaster from "@/components/Toaster";
import type { Viewport } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL, pageMetadata } from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site-wide defaults. Each page adds its own canonical URL and og:url via pageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ title: SITE_TITLE, description: SITE_DESCRIPTION }),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: `${SITE_URL}/` }],
  creator: SITE_NAME,
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
  // favicon.ico is picked up from src/app/ by Next's file convention.
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};


export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // data-theme is set by the inline script before hydration
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-body">
        <ThemeProvider>
          <ModeProvider>
            <Nav />
            <MainShell>{children}</MainShell>
            <CommandPalette />
            <Toaster />
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
