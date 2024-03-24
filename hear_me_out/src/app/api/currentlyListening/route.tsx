import { NEXT_PUBLIC_URL } from "@/app/config";
import { getCurrentlyPlaying } from "@/app/helpers/spotifyApi";
import { NextRequest, NextResponse } from "next/server";

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
    const spotifyResponse = await getCurrentlyPlaying(responseData.accesstoken);

    // Check if spotifyResponse has the item property and it's not null
    if (spotifyResponse && spotifyResponse.item) {
      const nowlistening = {
        artist: spotifyResponse.item.artists
          .map((artist: { name: any }) => artist.name)
          .join(", "),
        song: spotifyResponse.item.name,
        albumCover: spotifyResponse.item.album.images[0].url,
      };
      return NextResponse.json(nowlistening);
    } else {
      // Return a default response indicating nothing is currently being played
      return NextResponse.json({
        artist: "",
        song: "Nothing is currently being played",
        albumCover: `${NEXT_PUBLIC_URL}/hearmeout.png`, // Provide a path to a default image if necessary
      });
    }
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed error
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
