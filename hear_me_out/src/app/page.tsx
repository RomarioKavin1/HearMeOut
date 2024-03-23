import { fetchMetadata } from "frames.js/next";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "My Page",
    // provide a full URL to your /frames endpoint
    ...(await fetchMetadata(
      new URL("/frames", process.env.VERCEL_URL || "http://localhost:3000")
    )),
  };
}

export default function Page({ frameMetadata }: { frameMetadata: any }) {
  return (
    <div>
      <h1>Login Page</h1>
      <Link href="/api/login">
        <button>Login with Spotify</button>
      </Link>
      {/* Additional content */}
      <script type="application/ld+json">
        {JSON.stringify(frameMetadata)}
      </script>
    </div>
  );
}
