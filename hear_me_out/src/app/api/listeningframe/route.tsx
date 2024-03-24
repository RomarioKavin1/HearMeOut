import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";
import { NEXT_PUBLIC_URL } from "@/app/config";
import { Key } from "react";

const fetchRecentlyPlayed = async (fid: string) => {
  const response = await fetch(
    `${NEXT_PUBLIC_URL}/api/recentlyPlayed?fid=${fid}`,
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
      fetch(`${NEXT_PUBLIC_URL}/api/currentlyListening?fid=${fid ?? ""}`).then(
        (res) => res.json()
      ),
      fetchRecentlyPlayed(fid ?? ""),
    ]);

    // Handling empty response for current data
    const currentdata =
      currentdataResponse && Object.keys(currentdataResponse).length > 0
        ? currentdataResponse
        : {
            song: "Not listening to music",
            artist: "",
            albumCover: `${NEXT_PUBLIC_URL}/hearmeout.png`, // Provide a path to a default image
          };
    const svgContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #1E9C76, #2CAE77)",
          padding: "20px",
          fontFamily: "'Lato', sans-serif",
          fontSize: "14px",
          color: "#FFFFFF",
          width: "100%",
          height: "100%",
          alignItems: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
      >
        {/* Currently Playing Section */}
        <h1
          style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 15px 0" }}
        >
          Now Playing
        </h1>
        {/* Enhanced Currently Playing Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#282828",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "40px",
            width: "90%",
          }}
        >
          <img
            src={currentdata.albumCover}
            alt="Album cover"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              marginRight: "20px",
            }}
          />
          <div
            style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#fff",
                marginBottom: "8px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {truncateText(currentdata.song)}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#b3b3b3",
                fontSize: "16px",
              }}
            >
              {truncateText(currentdata.artist)}
            </div>
          </div>
        </div>
        <h2
          style={{
            flexGrow: 0,
            flexShrink: 0,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#FFFFFF",
            marginRight: "20px",
          }}
        >
          Recently Played
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
            overflowX: "auto",
            backgroundColor: "#282828",
            backdropFilter: "blur(10px)",
            borderRadius: "15px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            width: "90%",
          }}
        >
          {recentlyPlayed.map(
            (
              {
                songName,
                artist,
                image,
              }: { songName: string; artist: string; image: string },
              index: Key | null | undefined
            ) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "15px",
                  flexGrow: 0,
                  flexShrink: 0,
                }}
              >
                <img
                  src={image}
                  alt="Track"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    marginBottom: "10px",
                    border: "2px solid #FFFFFF",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      color: "#EFEFEF",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {truncateText(songName, 20)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      color: "#B2B2B2",
                      fontSize: "12px",
                    }}
                  >
                    {truncateText(artist, 20)}
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
