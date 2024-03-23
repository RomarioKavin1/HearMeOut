"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { exchangetoken } from "../helpers/spotifyApi";
import supabase from "../helpers/supaclient";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
const CallbackPage = () => {
  const [code, setCode] = useState<string>("");
  const [accesstoken, setAccesstoken] = useState<string>();
  const [refreshtoken, setRefreshtoken] = useState<string>();
  const [expiresin, setExpiresin] = useState<string>();
  const [fid, setFid] = useState<string>();
  const [auth, setAuth] = useState<boolean>(false);
  useEffect(() => {
    const fetchedCode = localStorage.getItem("auth_code");
    const fid = localStorage.getItem("fid");
    setFid(fid || "");
    setCode(fetchedCode ?? "");
  }, []);
  useEffect(() => {
    const getaccess = async () => {
      const data = await exchangetoken(code);
      setAccesstoken(data[0]);
      setRefreshtoken(data[1]);
      setExpiresin(data[2]);
    };
    if (code != null && code.length > 0) {
      getaccess();
    }
  }, [code]);
  useEffect(() => {
    if (accesstoken && refreshtoken && expiresin && fid) {
      console.log("Supabase Ready at", accesstoken);
      console.log("Supabase Ready rt", refreshtoken);
      console.log("Supabase Ready ei", expiresin);
      const entry = {
        FID: Number(fid),
        accesstoken: accesstoken,
        refreshtoken: refreshtoken,
        expires_in: Number(expiresin),
      };
      console.log("supabase entry", entry);
      supabase
        .from("profile")
        .insert([entry])
        .then((response) => {
          const { data, error } = response;

          if (error) {
            console.error("Error inserting data:", error);
            return;
          } else {
            console.log("Successfully inserted:", data);
            setAuth(true);
          }
        });
    }
  }, [accesstoken, refreshtoken, expiresin, fid]);
  return (
    <>
      {!auth ? (
        <div>Fetching tokens...</div>
      ) : (
        <>
          <Link href="/home">
            <button>Get your frame link</button>
          </Link>
        </>
      )}
    </>
  );
};

export default CallbackPage;
