import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "../../config";
import Link from "next/link";
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "What Am I listening to ?",
      action: "post",
      target: `${NEXT_PUBLIC_URL}/nowlistening`,
    },
    {
      label: "My stats",
    },
    {
      label: "Get my playlist",
    },
    {
      label: "Suggest songs",
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/hearmeout.png`,
    aspectRatio: "1.91:1",
  },
  input: {
    text: "Tell me a story",
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: "zizzamia.xyz",
  description: "LFG",
  openGraph: {
    title: "zizzamia.xyz",
    description: "LFG",
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <div>
      <>Your frame</>
    </div>
  );
}
