"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
export default function Page() {
  const { ready, authenticated, login } = usePrivy();
  useEffect(() => {
    if (authenticated) {
      redirect("/home");
    }
  }, [authenticated, ready]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-300 to-green-600">
      <Head>
        <title>Hear Me Out</title>
        <meta
          name="description"
          content="Discover Your Music DNA with Hear Me Out"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <div className="text-center p-5 justify-center items-center flex flex-col">
        <Image
          src="/transparent.png"
          alt="Hear Me Out Logo"
          width={240}
          height={240}
        />
        <h1 className="text-5xl font-bold text-white mt-4">Hear Me Out</h1>
        <p className="mt-4 text-xl text-green-100">
          Your Personalized Farcaster Frame for Music Stats
        </p>
        <div className="mt-10">
          <button
            className="text-green-900 bg-green-300 hover:bg-green-400 font-bold py-2 px-4 rounded"
            onClick={login}
          >
            Login with Privy
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full h-20 flex justify-center items-center border-t border-green-400">
        <p className="text-green-100 text-sm">
          Powered by{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Vercel
          </a>
        </p>
      </footer>
    </div>
  );
}
