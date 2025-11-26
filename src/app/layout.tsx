import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/contexts/AuthContext";
import { CartProvider } from "~/contexts/CartContext";

export const metadata: Metadata = {
  title: "KiosDarma Marketplace",
  description: "Marketplace UMKM terintegrasi dengan aplikasi kasir KiosDarma",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geist.variable}`}>
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <TRPCReactProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
