import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  AwaitedReactNode,
  Key,
  ReactPortal,
} from "react";
import satori from "satori";
import sharp from "sharp";
import * as fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { NEXT_PUBLIC_URL } from "@/app/config";

export async function GET(req: NextRequest, res: NextResponse) {
  const truncateText = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength - 3)}...`;
  };

  try {
    const fontFilePath = join(process.cwd(), "public", "Poppins-Regular.ttf");
    const fontData = fs.readFileSync(fontFilePath);
    const fid = req.nextUrl.searchParams.get("fid");
    const artistResponse = await fetch(
      `${NEXT_PUBLIC_URL}/api/topartist?fid=${fid}`
    );
    const trackResponse = await fetch(
      `${NEXT_PUBLIC_URL}/api/toptracks?fid=${fid}`
    );

    if (!artistResponse.ok || !trackResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    const artistsData = await artistResponse.json();
    const tracksData = await trackResponse.json();
    const svgImage = await satori(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: "Poppins, Arial, sans-serif",
          backgroundColor: "#2CAE77",
          color: "#FFFFFF",
          height: "100%",
          alignItems: "center",
          width: "100%",
          padding: "20px",
          gap: "10px",
        }}
      >
        {/* Header */}
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h1
            style={{ fontSize: "30px", fontWeight: "bold", color: "#FFFFFF" }}
          >
            Your Music Highlights
          </h1>
        </div> */}

        {/* Content Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          {/* Artists Section */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                width: "100%",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Top Artists
            </h2>
            {artistsData.map((artist, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px",
                  gap: "5px",
                  width: "180px",
                  textAlign: "center",
                }}
              >
                <img
                  src={artist.artistImage}
                  alt="Artist"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span style={{ fontSize: "14px", color: "#333" }}>
                  {truncateText(artist.artistName, 20)}
                </span>
              </div>
            ))}
          </div>

          {/* Tracks Section */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                width: "100%",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Top Tracks
            </h2>
            {tracksData.map((track, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px",
                  gap: "5px",
                  width: "180px",
                  textAlign: "center",
                }}
              >
                <img
                  src={track.image}
                  alt="Track"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {truncateText(track.songName, 20)} <br />
                    <small style={{ fontSize: "12px", color: "#666" }}>
                      by {truncateText(track.artist, 20)}
                    </small>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>,
      {
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
      }
    );

    const pngBuffer = await sharp(Buffer.from(svgImage))
      .toFormat("png")
      .toBuffer();
    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "max-age=10",
      },
      status: 200,
    });
  } catch (error) {
    console.log("ERROR IN FRAMES IMAGE API:");
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
