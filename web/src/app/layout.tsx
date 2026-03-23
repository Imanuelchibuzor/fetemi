import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fetemi | Editorial Automation & Intelligence",
  description: "The end-to-end automated publishing pipeline for Fetemi Marketing. Grounded in human decisions, scaled by AI.",
  openGraph: {
    title: "Fetemi | Editorial Automation",
    description: "Orchestrate your content pipeline with neural-grade precision.",
    type: "website",
    locale: "en_US",
    siteName: "Fetemi Engine",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fetemi | Editorial Automation",
    description: "AI-powered publishing workflow for modern editorial teams.",
  },
  icons: {
    icon: "/icon.svg",
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${dmSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-primary selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
