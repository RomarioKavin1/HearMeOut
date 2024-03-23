"use client";
import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "../config";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "What Am I listening to ?",
      action: "post",
      target: `${NEXT_PUBLIC_URL}/nowlistening`,
    },
    {
      label: "My stats",
    },
    {
      label: "Get my playlist",
    },
    {
      label: "Suggest songs",
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/hearmeout.png`,
    aspectRatio: "1.91:1",
  },
  input: {
    text: "Tell me a story",
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: "zizzamia.xyz",
  description: "LFG",
  openGraph: {
    title: "zizzamia.xyz",
    description: "LFG",
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  // const router = useRouter();

  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch('/api/login');
  //     if (response.ok) {
  //       // Redirect to the Spotify authorization page
  //       redirect(response.url); // This assumes the response is a redirect URL
  //     } else {
  //       console.error('Failed to fetch');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
  const { ready, authenticated, login } = usePrivy();
  const disableLogin = !ready || (ready && authenticated);

  return (
    <div>
      <h1>Login Page</h1>
      <button disabled={disableLogin} onClick={login}>
        Log in with privy
      </button>
      <Link href="/api/login">
        <button>Login with Spotify</button>
      </Link>
      {/* {accessToken && (
          <div>
            <h2>Access Token:</h2>
            <p>{accessToken}</p>
          </div>
        )}
        {refreshToken && (
          <div>
            <h2>Refresh Token:</h2>
            <p>{refreshToken}</p>
          </div>
        )} */}
    </div>
  );
}
