"use client";
import { useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      localStorage.setItem("auth_code", code);
      redirect("/getaccess");
    }
  }, [code]);

  return <div>Redirecting...</div>;
};

export default CallbackPage;
