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
type State = {
  lastClickedButton: string | null;
};

const initialState: State = { lastClickedButton: null };

const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  switch (buttonIndex) {
    case 1:
      return { ...state, lastClickedButton: "Now Listening" };
    case 2:
      return { ...state, lastClickedButton: "My Stats" };
    case 3:
      return { ...state, lastClickedButton: "Get My Playlist" };
    default:
      return state;
  }
};

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
      <FrameImage
        src={`${NEXT_PUBLIC_URL}/hearmeout.png`}
        aspectRatio="1.91:1"
      />
      <FrameButton target={`${NEXT_PUBLIC_URL}/nowlistening/${params.slug}`}>
        Now Listening
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
    </FrameContainer>
  );
}
