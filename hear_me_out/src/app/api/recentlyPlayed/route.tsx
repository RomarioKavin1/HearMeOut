// pages/api/recently-played.ts

import { NEXT_PUBLIC_URL } from "@/app/config";
import { NextRequest, NextResponse } from "next/server";

type Track = {
  songName: string;
  artist: string;
  image: string | undefined;
};

const fetchRecentlyPlayedTracks = async (
  accessToken: string
): Promise<Track[]> => {
  const url = "https://api.spotify.com/v1/me/player/recently-played?limit=3";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    songName: item.track.name,
    artist: item.track.artists.map((artist: any) => artist.name).join(", "),
    image: item.track.album.images[0]?.url,
  }));
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (req.method === "GET") {
    const fid = req.nextUrl.searchParams.get("fid");
    const response = await fetch(`${NEXT_PUBLIC_URL}/api/tokenvalidity`, {
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
    const spotifyResponse = await fetchRecentlyPlayedTracks(
      responseData.accesstoken
    );
    return NextResponse.json(spotifyResponse);
  } else {
    // If the request method is not GET, return a 405 Method Not Allowed error
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
