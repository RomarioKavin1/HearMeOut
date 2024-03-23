"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { redirect, useSearchParams } from "next/navigation";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      localStorage.setItem("auth_code", code);

      redirect("/home");
    }
  }, [code]);

  return <div>Redirecting...</div>;
};

export default CallbackPage;
