"use client";
import { useEffect, useState } from "react";
import { exchangetoken } from "../helpers/spotifyApi";
import supabase from "../helpers/supaclient";
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
      const entry = {
        FID: Number(fid),
        accesstoken: accesstoken,
        refreshtoken: refreshtoken,
        expires_in: Number(expiresin),
      };
      supabase
        .from("profile")
        .insert([entry])
        .then((response) => {
          const { data, error } = response;

          if (error) {
            console.error("Error inserting data:", error);
            return;
          } else {
            setAuth(true);
          }
        });
    }
  }, [accesstoken, refreshtoken, expiresin, fid]);
  return (
    <>
      {!auth ? (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-300 to-green-600">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-green-900 h-24 w-24"></div>
          <style jsx>{`
            .loader {
              border-top-color: #ffffff;
              animation: spin 1s infinite linear;
            }
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-300 to-green-600 flex-col">
            <h1>Authentication Success!</h1>
            <Link href="/home">
              <button className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
                Get your Frame
              </button>
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default CallbackPage;
