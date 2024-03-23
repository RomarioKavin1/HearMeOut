import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.method === "POST") {
    const data = await req.json();
    const { code } = data;
    const encodedCredentials = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodedCredentials}`,
    };

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${process.env.SPOTIFY_REDIRECT_URI}`,
    });

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        const re = NextResponse.json({
          error: response.statusText,
        });
      }

      const data = await response.json(); // Assuming Spotify returns JSON data
      const resp = NextResponse.json(data);
      return resp;
      // Send the data back to the client
    } catch (error) {
      const response = NextResponse.json({
        error: "errpr",
      });
      return response;
    }
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed error
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
