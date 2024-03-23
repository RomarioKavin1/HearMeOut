import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/helpers/supaclient";
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.method === "POST") {
    const data = await req.json();
    const { fid } = data;

    const { data: dt, error } = await supabase
      .from("profile")
      .select("*") // Select all columns or specify the ones you need
      .eq("FID", fid)
      .single(); // Use this if you're sure there's only one row with this fid
    const encodedCredentials = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");
    if (error) {
      console.error("Error fetching data:", error);
      const resp = NextResponse.json(
        { Message: "Error fetching from supabase invalid fid", Errmsg: error },
        { status: 400 }
      );
      return resp;
    } else {
      const { created_at, refreshtoken, accesstoken } = dt;
      const createdAtDate = new Date(created_at);
      const createdAtTimestamp = createdAtDate.getTime();
      const nowTimestamp = new Date().getTime();
      const differenceInHours =
        (nowTimestamp - createdAtTimestamp) / (1000 * 60 * 60);
      if (differenceInHours > 1) {
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodedCredentials}`,
        };
        const body = new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshtoken,
        });

        try {
          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers,
              body,
            }
          );

          if (!response.ok) {
            const re = NextResponse.json(
              {
                Message: "Error fetching new access token",
                error: response.statusText,
              },
              { status: 400 }
            );
            return re;
          }

          const data = await response.json(); // Assuming Spotify returns JSON data
          const at = data.access_token;
          const rt = data.refresh_token;
          const newValues = {
            accesstoken: at,
            refreshtoken: rt,
            created_at: new Date().toISOString(),
          };
          const { data: dtt, error } = await supabase
            .from("profile")
            .update(newValues)
            .eq("FID", fid);

          if (error) {
            console.error("Error updating data:", error);
            const resp = NextResponse.json(
              { Message: "Error updating supabase", Errmsg: error },
              { status: 400 }
            );
            return resp;
          } else {
            const resp = NextResponse.json(
              { accesstoken: data.access_token },
              { status: 200 }
            );
            return resp;
          }
        } catch (error) {
          const response = NextResponse.json({
            error: "errpr",
          });
          return response;
        }
      } else {
        const resp = NextResponse.json(
          { accesstoken: accesstoken },
          { status: 200 }
        );
        return resp;
      }
    }
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed error
    return NextResponse.json({ error: "Method Not Allowed" });
  }
}
