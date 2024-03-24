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

export async function GET(req: NextRequest, res: NextResponse) {
  const truncateText = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength - 3)}...`;
  };

  try {
    const fontFilePath = join(process.cwd(), "public", "Lato-Regular.ttf");
    const fontData = fs.readFileSync(fontFilePath);
    const fid = req.nextUrl.searchParams.get("fid");
    const artistResponse = await fetch(
      `http://localhost:3000/api/topartist?fid=${fid}`
    );
    const trackResponse = await fetch(
      `http://localhost:3000/api/toptracks?fid=${fid}`
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
          fontFamily: "Arial",
          backgroundColor: "#2CAE77",
          height: "100%",
          justifyItems: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Artists Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%",
          }}
        >
          <h1>Top Artists</h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {artistsData.map(
              (
                artist: { artistImage: string | undefined; artistName: string },
                index: Key | null | undefined
              ) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  <img
                    src={artist.artistImage}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    alt="Artist"
                  />
                  <span style={{ marginTop: "5px", fontSize: "12px" }}>
                    {truncateText(artist.artistName)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Tracks Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexWrap: "wrap",
            width: "50%",
          }}
        >
          <h1>Top Tracks</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {tracksData.map(
              (
                track: {
                  image: string | undefined;
                  songName: string;
                  artist: string;
                },
                index: Key | null | undefined
              ) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  <img
                    src={track.image}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    alt="Track"
                  />
                  <span
                    style={{
                      marginTop: "5px",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {truncateText(track.songName)} <br />{" "}
                      <small>by {truncateText(track.artist)}</small>
                    </div>
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>,
      {
        width: 955,
        height: 500,
        fonts: [
          {
            data: fontData,
            name: "Lato-Regular",
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
