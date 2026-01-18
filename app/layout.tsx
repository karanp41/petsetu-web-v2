import { AuthProvider } from "@/components/auth/AuthProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://petsetu.com"),
  title: {
    default: "PetSetu - Buy, Sell & Adopt Pets | Trusted Pet Marketplace",
    template: "%s | PetSetu",
  },
  description:
    "PetSetu is your trusted platform for buying, selling, and adopting pets online. Discover certified dog breeders, adoption guides, and expert pet care tips.",
  keywords: [
    "buy pets online",
    "sell pets online",
    "pet adoption",
    "dog breeders",
    "cat breeders",
    "adopt a pet",
    "pet care tips",
    "pet marketplace",
    "pet classifieds",
    "pet adoption guides",
    "online pet shop",
    "find pets online",
    "dog adoption",
    "cat adoption",
    "exotic pets",
    "certified breeders",
    "puppy adoption",
    "kitten adoption",
    "pet adoption platform",
    "pet buying",
    "pet selling",
  ],
  authors: [{ name: "PetSetu" }],
  robots: { index: true, follow: true },
  openGraph: {
    title:
      "PetSetu - Buy, Sell, and Adopt Pets Online | Dog Breeders & Pet Care Tips",
    description:
      "Discover the best platform to buy, sell, and adopt pets. Explore certified dog breeders and expert pet care tips at PetSetu.",
    url: "https://petsetu.com/",
    siteName: "PetSetu",
    images: [
      {
        url: "https://petsetu.com/assets/img/petsetu-og-image.png",
        width: 1200,
        height: 630,
        alt: "PetSetu Open Graph Image",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetSetu - Buy, Sell, and Adopt Pets Online",
    description:
      "Explore PetSetu for buying, selling, and adopting pets online. Find certified dog breeders and expert pet care tips.",
    images: ["https://petsetu.com/images/petsetu-twitter-image.jpg"],
    site: "@PetSetu",
    creator: "@PetSetu",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.png"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_MEASUREMENT_ID =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-X32G96QNQ9";
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9965031619855172"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </AuthProvider>
        {/* Google tag (gtag.js) */}
        <Script
          id="gtag-lib"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
