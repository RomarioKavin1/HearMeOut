"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrivyProvider } from "@privy-io/react-auth";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appid = process.env.PRIVY_APP_ID;
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProvider
          appId="clu3tstkx0gb311yd07mtz0b8"
          config={{
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              logo: "https://your-logo-url",
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}
