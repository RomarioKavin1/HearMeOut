import { NextRequest, NextResponse } from "next/server";
import { fetchSpotifyUserData } from "@/app/helpers/spotifyApi"; // Make sure to implement this function
import { NEXT_PUBLIC_URL } from "@/app/config";

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

    const spotifyUserData = await fetchSpotifyUserData(
      responseData.accesstoken
    );
    if (spotifyUserData) {
      const userProfile = {
        uri: spotifyUserData.uri,
      };
      const spotifyUri = spotifyUserData.uri;
      const parts = spotifyUri.split(":");
      const type = parts[1];
      const id = parts[2];
      const spotifyUrl = `https://open.spotify.com/${type}/${id}`;
      return NextResponse.redirect(spotifyUrl);
    } else {
      // Return a default response indicating user data could not be retrieved
      return NextResponse.json({
        error: "Unable to retrieve user data",
      });
    }
  } else {
    // If the request method is not GET, return a 405 Method Not Allowed error
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
