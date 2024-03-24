import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { NEXT_PUBLIC_URL } from "../../config";
import { ClientProtocolId } from "frames.js";

type State = {
  lastClicked: string;
};

const initialState: State = { lastClicked: "" };

const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;
  switch (buttonIndex) {
    case 1:
      return { ...state, lastClicked: "Home" };
    case 2:
      return { ...state, lastClicked: "Stats" };
    case 3:
      return { ...state, lastClicked: "Get my playlist" };
    default:
      return state;
  }
};
const acceptedProtocols: ClientProtocolId[] = [
  {
    id: "xmtp",
    version: "vNext",
  },
  {
    id: "farcaster",
    version: "vNext",
  },
];
export default async function FramePage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string>;
  params: { slug: string };
}) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  return (
    <FrameContainer
      postUrl={`${NEXT_PUBLIC_URL}/api/frame`}
      state={state}
      previousFrame={previousFrame}
      accepts={acceptedProtocols}
    >
      <FrameButton target={`${NEXT_PUBLIC_URL}/frame/${params.slug}`}>
        Home
      </FrameButton>
      <FrameButton target={`${NEXT_PUBLIC_URL}/stats/${params.slug}`}>
        Stats
      </FrameButton>
      <FrameButton
        action="link"
        target={`${NEXT_PUBLIC_URL}/api/getspotiuri?fid=${params.slug}`}
      >
        Get my profile
      </FrameButton>
      <FrameImage
        src={`${NEXT_PUBLIC_URL}/api/listeningframe?fid=${params.slug}`}
        aspectRatio="1.91:1"
      />
    </FrameContainer>
  );
}
