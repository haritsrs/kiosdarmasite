import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/contexts/AuthContext";
import { CartProvider } from "~/contexts/CartContext";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { StructuredData } from "~/components/seo/StructuredData";

export const metadata: Metadata = {
  title: {
    default: "KiosDarma Marketplace",
    template: "%s | KiosDarma Marketplace",
  },
  description: "Marketplace UMKM terintegrasi dengan aplikasi kasir KiosDarma. Belanja kebutuhan warung dan rumah tangga langsung dari merchant terpercaya.",
  keywords: ["marketplace", "UMKM", "warung", "belanja online", "KiosDarma", "grosir", "retail"],
  authors: [{ name: "KiosDarma" }],
  creator: "KiosDarma",
  publisher: "KiosDarma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "KiosDarma Marketplace",
    title: "KiosDarma Marketplace",
    description: "Marketplace UMKM terintegrasi dengan aplikasi kasir KiosDarma",
    images: [
      {
        url: "/img/logo.png",
        width: 1200,
        height: 630,
        alt: "KiosDarma Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KiosDarma Marketplace",
    description: "Marketplace UMKM terintegrasi dengan aplikasi kasir KiosDarma",
    images: ["/img/logo.png"],
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
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap", // Optimize font loading
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KiosDarma Marketplace",
    url: baseUrl,
    logo: `${baseUrl}/img/logo.png`,
    description: "Marketplace UMKM terintegrasi dengan aplikasi kasir KiosDarma",
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KiosDarma Marketplace",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="id" className={`${geist.variable}`}>
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-purple-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Skip to main content
        </a>
        <TRPCReactProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <div id="main-content">{children}</div>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
