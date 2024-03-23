import { createFrames, Button } from "frames.js/next";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  return {
    image: `${NEXT_PUBLIC_URL}/api/image?id=123`,
    buttons: [
      <Button key={1} action="post" target={{ query: { value: "Yes" } }}>
        Story time
      </Button>,
      <Button key={2} action="post" target={{ query: { value: "Yes" } }}>
        Send Base Sepolia
      </Button>,
    ],
    input: {
      placeholder: "Tell me a story",
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
