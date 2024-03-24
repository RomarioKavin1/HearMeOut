import { NextRequest, NextResponse } from "next/server";
import { fetchSpotifyUserData } from "@/app/helpers/spotifyApi"; // Make sure to implement this function

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

    const spotifyUserData = await fetchSpotifyUserData(
      responseData.accesstoken
    );

    if (spotifyUserData) {
      const userProfile = {
        displayName: spotifyUserData.display_name,
        followers: spotifyUserData.followers.total,
        id: spotifyUserData.id,
      };
      return NextResponse.json(userProfile);
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
