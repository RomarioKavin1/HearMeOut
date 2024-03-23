import { NextRequest, NextResponse } from "next/server";

type Track = {
  songName: string;
  artist: string;
  image: string | undefined;
};

const fetchTopTracks = async (accessToken: string): Promise<Track[]> => {
  const url = "https://api.spotify.com/v1/me/top/tracks?limit=5";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    songName: item.name,
    artist: item.artists.map((artist: any) => artist.name).join(", "),
    image: item.album.images[0]?.url,
  }));
};

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
    const spotifyResponse = await fetchTopTracks(responseData.accesstoken);
    return NextResponse.json(spotifyResponse);
  } else {
    // If the request method is not GET, return a 405 Method Not Allowed error
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
