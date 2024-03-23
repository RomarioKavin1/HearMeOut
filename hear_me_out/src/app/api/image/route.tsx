import { NextRequest, NextResponse } from "next/server";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const fontFilePath = join(process.cwd(), "public", "Lato-Regular.ttf");
    const fontData = fs.readFileSync(fontFilePath);
    const dat = {
      artist: "weeknd",
      song: "blinding lights",
      albumCover:
        "https://i.scdn.co/image/ab67616d00001e024718e2b124f79258be7bc452",
    };
    const fid = req.nextUrl.searchParams.get("fid");
    const { artist, song, albumCover } = dat;
    let pollSvg;
    pollSvg = await satori(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#F7F7F7",
          fontSize: 24,
          justifyItems: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "300px",
            height: "80px",
            backgroundColor: "#282828",
            borderRadius: "8px",
            padding: "8px",
            boxSizing: "border-box",
          }}
          className="audio-player"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "64px",
              height: "64px",
              backgroundColor: "#fff",
              borderRadius: "50%",
              marginRight: "12px",
            }}
            className="album-cover"
          >
            <img
              src={albumCover}
              alt="Album cover"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </div>
          <div
            style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            className="player-controls"
          >
            <div
              style={{
                marginBottom: "4px",
                display: "flex",
                flexDirection: "column",
              }}
              className="song-info"
            >
              <div
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  margin: "0",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="song-title"
              >
                {song}
              </div>
              <p
                style={{ fontSize: "12px", color: "#b3b3b3", margin: "0" }}
                className="artist"
              >
                {artist}
              </p>
            </div>
            <div
              style={{
                width: "100%",
                height: "4px",
                backgroundColor: "#4f4f4f",
                borderRadius: "2px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              className="progress-bar"
            >
              <div
                style={{
                  width: "50%",
                  height: "100%",
                  backgroundColor: "#1db954",
                  transformOrigin: "left",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="progress"
              ></div>
            </div>
            <div style={{ display: "flex" }} className="buttons">
              <div
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  marginRight: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="play-btn"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-play-fill"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: "white" }}
                >
                  <path
                    fill="white"
                    d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
                  ></path>
                </svg>
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  marginRight: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
                className="pause-btn"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="bi bi-pause-fill"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: "white" }}
                >
                  <path
                    fill="white"
                    d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>,

      {
        width: 600,
        height: 400,
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
    const pngBuffer = await sharp(Buffer.from(pollSvg))
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
