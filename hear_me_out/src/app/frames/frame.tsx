// ./app/frames/frame.tsx
import { createFrames, Button } from "frames.js/next";

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL; // Make sure this environment variable is defined

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  return {
    image: `${NEXT_PUBLIC_URL}/api/image?id=123`, // Ensure this matches the expected type
    // If aspectRatio is required, it might need to be part of an 'imageOptions' object
    buttons: [
      // Ensure each button conforms to the expected structure
      <Button key={1} action="post" target={{ query: { value: "Yes" } }}>
        Story time
      </Button>,
      <Button key={2} action="post" target={{ query: { value: "Yes" } }}>
        Send Base Sepolia
      </Button>,
    ],
    input: {
      placeholder: "Tell me a story", // Confirm this structure is correct
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
