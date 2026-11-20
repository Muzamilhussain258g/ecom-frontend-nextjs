import { createHash } from "node:crypto";
import { getAccessToken } from "@/lib/api/cookies";
import { WishlistProvider } from "@/hooks/use-wishlist";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { SiteFooterChrome } from "@/components/SiteChrome";
import { SITE_URL } from "@/lib/api/config";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SHOP.CO",
    template: "%s | SHOP.CO",
  },
  description: "SHOP.CO — modern fashion ecommerce storefront.",
  openGraph: {
    siteName: "SHOP.CO",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessToken = await getAccessToken();
  const sessionKey = accessToken
    ? createHash("sha256").update(accessToken).digest("hex")
    : "guest";
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <WishlistProvider key={sessionKey} authenticated={Boolean(accessToken)}>
          <TooltipProvider>
            <Header />
            {children}
            <SiteFooterChrome />
            <Toaster />
          </TooltipProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
