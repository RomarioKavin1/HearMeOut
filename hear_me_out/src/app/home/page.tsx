"use client";
import React, { useEffect, useState } from "react";
import { getCurrentlyPlaying } from "../helpers/spotifyApi";
import { usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
const Page = () => {
  const [code, setCode] = useState<string>("");
  const [accesstoken, setAccesstoken] = useState<string>("");
  const [refreshtoken, setRefreshtoken] = useState<string>("");
  const handleExchangeToken = async () => {
    try {
      const response = await fetch("/api/gettoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Token exchange failed: ${errorData.error}`);
      }

      const data = await response.json();
      console.log("Token data:", data);
      setAccesstoken(data.access_token);
      setRefreshtoken(data.refresh_token);
      const currently = await getCurrentlyPlaying(data.access_token);
    } catch (error) {
      console.error("Error exchanging token:", error);
    }
  };

  useEffect(() => {
    const fetchedCode = localStorage.getItem("auth_code");
    setCode(fetchedCode ?? "");
  }, []);
  useEffect(() => {
    if (code?.length) {
      console.log("code in home", code);
      handleExchangeToken();
    }
  }, [code]);
  useEffect(() => {
    console.log("accesstoken", accesstoken);
  }, [accesstoken]);
  const { user, logout, authenticated } = usePrivy();
  useEffect(() => {
    if (!authenticated) {
      redirect("/");
    }
  }, [authenticated]);
  return (
    <div>
      <h1>Welcome Home</h1>
      <p>
        <strong>Code:</strong> {code || "Not Available"}
        <br />
        <strong>Access Token:</strong> {accesstoken || "Not Available"}
        <br />
        <strong>Refresh Token:</strong> {refreshtoken || "Not Available"}
        <br />
        <strong>User:</strong> {user?.farcaster?.fid || "Not Available"}
        <br />
        <strong>User:</strong> {user?.farcaster?.displayName || "Not Available"}
        <br />
        <button onClick={logout}>Logout</button>
      </p>
    </div>
  );
};

export default Page;
