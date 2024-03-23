import { getCurrentlyPlaying } from "@/app/helpers/spotifyApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (req.method === "GET") {
    const fid = req.nextUrl.searchParams.get("fid");
    const response = await fetch("http://localhost:3000/api/tokenvalidity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fid }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      return NextResponse.json(responseData);
    }
    const spotifyResponse = await getCurrentlyPlaying(responseData.accesstoken);
    const nowlistening = {
      artist: spotifyResponse.item.artists
        .map((artist: { name: any }) => artist.name)
        .join(", "),
      song: spotifyResponse.item.name,
      albumCover: spotifyResponse.item.album.images[0].url,
    };
    return NextResponse.json(nowlistening);
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed error
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
