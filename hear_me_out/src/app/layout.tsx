"use client";
import { Inter, Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { NEXT_PUBLIC_URL } from "./config";
const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: "100",
});
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appid = process.env.PRIVY_APP_ID;
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <PrivyProvider
          appId="clu3tstkx0gb311yd07mtz0b8"
          config={{
            appearance: {
              theme: "light",
              accentColor: "#676FFF",
              logo: `${NEXT_PUBLIC_URL}/transparent.png`,
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
