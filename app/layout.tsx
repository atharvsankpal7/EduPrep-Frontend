
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/components/providers/query-provider";
import { StoreHydrationGate } from "@/components/providers/store-hydration-gate";
import { AuthGuard } from "@/components/providers/auth-guard";
import { Footer } from "@/components/footer";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.eduprep.app"
  ),
  title: {
    template: "%s | EduPrep",
    default: "EduPrep | Advanced Online Test Platform for Competitive Exams",
  },
  description:
    "Master your exams with EduPrep. Access proctored mock tests, detailed analytics, and comprehensive test preparation materials.",
  keywords: [
    "online test platform",
    "mock tests",
    "exam preparation",
    "competitive exams",
    "test analytics",
  ],
  authors: [{ name: "EduPrep Team" }],
  creator: "EduPrep",
  publisher: "EduPrep",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "EduPrep",
    title: "EduPrep | Advanced Online Test Platform",
    description: "Master your exams with EduPrep mock tests and analytics.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EduPrep Platform Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduPrep | Advanced Online Test Platform",
    description: "Master your exams with EduPrep mock tests and analytics.",
    images: ["/twitter-image.jpg"],
    creator: "@eduprep",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <StoreHydrationGate>
              <AuthGuard>
                <div className="flex flex-col min-h-screen ">
                  <main className="flex-1 bg-background ">{children}</main>
                  <Footer />
                </div>
              </AuthGuard>
            </StoreHydrationGate>
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

