import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";
import { NEXT_PUBLIC_URL } from "@/app/config";

const fetchRecentlyPlayed = async (fid: string) => {
  const response = await fetch(
    `http://localhost:3000/api/recentlyPlayed?fid=${fid}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch recently played tracks");
  return response.json();
};

const truncateText = (text: string, maxLength = 60) =>
  text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const fontFilePath = join(process.cwd(), "public", "Poppins-Regular.ttf");
    const fontData = fs.readFileSync(fontFilePath);
    const fid = req.nextUrl.searchParams.get("fid");

    const [currentdataResponse, recentlyPlayed] = await Promise.all([
      fetch(
        `http://localhost:3000/api/currentlyListening?fid=${fid ?? ""}`
      ).then((res) => res.json()),
      fetchRecentlyPlayed(fid ?? ""),
    ]);

    // Handling empty response for current data
    const currentdata =
      currentdataResponse && Object.keys(currentdataResponse).length > 0
        ? currentdataResponse
        : {
            song: "Not listening to music",
            artist: "N/A",
            albumCover: `${NEXT_PUBLIC_URL}/hearmeout.png`, // Provide a path to a default image
          };
    const svgContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#2CAE77",
          padding: "20px",
          fontFamily: "Lato",
          fontSize: "14px",
          width: "100%",
          height: "100%",
          alignItems: "center",
        }}
      >
        {/* Currently Playing Section */}
        <h1>Now playing</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#282828",
            borderRadius: "4px",
            padding: "10px",
            marginBottom: "20px",
            width: "90%",
          }}
        >
          <img
            src={currentdata.albumCover}
            alt="Album cover"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              marginRight: "12px",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#fff", marginBottom: "4px" }}>
              {truncateText(currentdata.song)}
            </div>
            <div style={{ color: "#b3b3b3", fontSize: "12px" }}>
              {truncateText(currentdata.artist)}
            </div>
          </div>
        </div>

        {/* Recently Played Section */}
        <div style={{ display: "flex", flexDirection: "column", width: "90%" }}>
          <h2 style={{ color: "#282828", marginBottom: "10px" }}>
            Recently Played
          </h2>
          {recentlyPlayed.map(
            (
              {
                songName,
                artist,
                image,
              }: { songName: string; artist: string; image: string },
              index: number
            ) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={image}
                  alt="Track"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    marginRight: "8px",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ color: "#282828", fontSize: "14px" }}>
                    {truncateText(songName)}
                  </div>
                  <div style={{ color: "#707070", fontSize: "12px" }}>
                    {truncateText(artist)}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );

    const svgImage = await satori(svgContent, {
      width: 955,
      height: 500,
      fonts: [
        {
          data: fontData,
          name: "Poppins-Regular",
          style: "normal",
          weight: 400,
        },
      ],
    });

    const pngBuffer = await sharp(Buffer.from(svgImage))
      .toFormat("png")
      .toBuffer();

    return new NextResponse(pngBuffer, {
      headers: { "Content-Type": "image/png", "Cache-Control": "max-age=10" },
      status: 200,
    });
  } catch (error) {
    console.error("ERROR IN FRAMES IMAGE API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
