"use client";
import React, { useEffect, useState } from "react";
import supabase from "../helpers/supaclient";
import { usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
function Page() {
  const { user, logout, authenticated } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [spotifyauth, setspotifyauth] = useState(false);
  const fidToCheck = user?.farcaster?.fid;

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

        // Check if the fid is found
        if (data.length > 0) {
          console.log(data);
          setspotifyauth(true);
        } else {
          console.log(data);

          setspotifyauth(false);
        }
      });
    setLoading(false);
  }, [fidToCheck, user]);

  useEffect(() => {}, [loading]);
  return (
    <div>
      <h1>Welcome Home</h1>
      <strong>User:</strong> {user?.farcaster?.fid || "Not Available"}
      <br />
      <p>
        <strong>User:</strong> {user?.farcaster?.displayName}
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : spotifyauth ? (
        <p>Spotify Authenticated</p>
      ) : (
        <>
          <p>Spotify Not Authenticated</p>
          <Link href="/api/login">
            <button>Authenticate Spotify to generate your frame</button>
          </Link>
        </>
      )}
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Page;
