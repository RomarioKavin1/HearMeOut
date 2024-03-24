import { NEXT_PUBLIC_URL } from "@/app/config";
import { NextRequest, NextResponse } from "next/server";

type Artist = {
  artistName: string;
  artistImage: string | undefined;
};

const fetchTopArtists = async (accessToken: string): Promise<Artist[]> => {
  const url = "https://api.spotify.com/v1/me/top/artists?limit=3";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    artistName: item.name,
    artistImage: item.images[0]?.url,
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
    const spotifyResponse = await fetchTopArtists(responseData.accesstoken);
    return NextResponse.json(spotifyResponse);
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed error
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
