"use client";
import React, { useEffect, useState } from "react";
import supabase from "../helpers/supaclient";
import { usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { NEXT_PUBLIC_URL } from "../config";

function Page() {
  const { user, logout, authenticated } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [spotifyauth, setSpotifyAuth] = useState(false);
  const [spotifyAccount, setSpotifyAccount] = useState(null);
  const fidToCheck = user?.farcaster?.fid;
  const [copySuccess, setCopySuccess] = useState("");
  useEffect(() => {
    if (!authenticated) {
      redirect("/");
    }
  }, [authenticated]);

  useEffect(() => {
    localStorage.setItem("fid", fidToCheck?.toString() || "");
    supabase
      .from("profile")
      .select("FID")
      .eq("FID", fidToCheck)
      .then((response) => {
        const { data, error } = response;

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        if (data.length > 0) {
          setSpotifyAuth(true);
          // Fetch Spotify account data
          fetch(`${NEXT_PUBLIC_URL}/api/getspotifyaccount?fid=${fidToCheck}`)
            .then((res) => res.json())
            .then((data) => {
              setSpotifyAccount(data);
            })
            .catch((error) =>
              console.error("Error fetching Spotify account:", error)
            );
        } else {
          setSpotifyAuth(false);
        }
      });

    setLoading(false);
  }, [fidToCheck, user]);
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(`${NEXT_PUBLIC_URL}/frame/${fidToCheck}`)
      .then(() => setCopySuccess("Copied!"))
      .catch((err) => console.error("Error copying text: ", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 to-green-600 text-white flex flex-col justify-center items-center p-4">
      <Head>
        <title>Home | Hear Me Out</title>
      </Head>

      {/* Logo */}
      <div className="mb-10">
        <Image src="/transparent.png" alt="Logo" width={240} height={240} />
      </div>

      {/* Farcaster Account Card */}
      <div className="bg-green-700 p-5 rounded-lg shadow-lg mb-4 flex flex-col items-center space-y-4">
        <h1 className="text-xl font-bold">Logged in with Farcaster</h1>
        {user?.farcaster?.pfp && (
          <Image
            src={user?.farcaster?.pfp}
            alt="Profile Picture"
            height={100}
            width={100}
            className="rounded-full"
          />
        )}
        <div>
          <p>
            <strong>User FID:</strong> {user?.farcaster?.fid || "Not Available"}
          </p>
          <p>
            <strong>Display Name:</strong>{" "}
            {user?.farcaster?.displayName || "Not Available"}
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : spotifyauth ? (
          <>
            <div className="bg-green-700 p-5 rounded-lg shadow-lg flex flex-col justify-center items-center">
              <div className="justify-start items-start">
                <h1 className="text-xl font-bold mb-4">
                  Spotify Authenticated
                </h1>
                <p>
                  <strong>Name:</strong>{" "}
                  {spotifyAccount?.displayName || "Not Available"}
                </p>
                <p>
                  <strong>Followers:</strong> {spotifyAccount?.followers || 0}
                </p>
                <p>
                  <strong>Your Frame:</strong>
                  <br /> {`${NEXT_PUBLIC_URL}/frame/${fidToCheck}`}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded justify-center items-center mt-5"
              >
                Copy frame link
              </button>
              {copySuccess && <div className="mt-2 text-sm">{copySuccess}</div>}
            </div>
          </>
        ) : (
          <>
            <p>Spotify Not Authenticated</p>
            <Link href="/api/login">
              <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                Authenticate Spotify
              </button>
            </Link>
          </>
        )}
      </div>

      <footer className="w-full h-20 flex justify-center items-center text-green-900 mt-10">
        <p>Powered by Vercel</p>
      </footer>
    </div>
  );
}

export default Page;
