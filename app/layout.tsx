
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
  title: "ADCET - Online Test Platform",
  description:
    "Enhance your test preparation with our advanced mock test platform",
  icons: {
    icon: "/favicon.ico",
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

