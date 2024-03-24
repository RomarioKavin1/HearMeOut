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

  return (
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
  );
};

export default CallbackPage;
