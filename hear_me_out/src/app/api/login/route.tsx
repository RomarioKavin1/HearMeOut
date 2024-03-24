import querystring from "querystring";
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

// Function to generate a random string
function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const state = generateRandomString(16);
  const scope =
    "user-read-private user-read-email user-read-recently-played user-read-currently-playing user-read-playback-state user-top-read user-library-read user-follow-read";

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state,
    showdialog: "true",
  });
  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${queryParams}`
  );
  return response;
}
