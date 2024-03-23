"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Page() {
  const { ready, authenticated, login } = usePrivy();
  useEffect(() => {
    if (authenticated) {
      redirect("/home");
    }
  }, [authenticated]);
  const disableLogin = !ready || (ready && authenticated);
  return (
    <div>
      <h1>Login Page</h1>
      <button disabled={disableLogin} onClick={login}>
        Log in with privy
      </button>
    </div>
  );
}
