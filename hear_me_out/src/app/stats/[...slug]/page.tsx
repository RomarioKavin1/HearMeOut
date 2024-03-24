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
  activeButton: string;
};

const initialState: State = {
  activeButton: "",
};

const reducer: FrameReducer<State> = (state, action) => {
  switch (action.postBody?.untrustedData.buttonIndex) {
    case 1:
      return { ...state, activeButton: "Button 1 was clicked" };
    case 2:
      return { ...state, activeButton: "Button 2 was clicked" };
    default:
      return state;
  }
};

export default function FramePage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string>;
  params: { slug: string };
}) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  const postUrl = `${NEXT_PUBLIC_URL}/api/frame`;

  return (
    <FrameContainer
      postUrl={postUrl}
      state={state}
      previousFrame={previousFrame}
      accepts={acceptedProtocols}
    >
      <FrameImage
        src={`${NEXT_PUBLIC_URL}/api/statsframe?fid=${params.slug}`}
        aspectRatio="1.91:1"
      />
      <FrameButton target={`${NEXT_PUBLIC_URL}/nowlistening/${params.slug}`}>
        Now Listening
      </FrameButton>
      <FrameButton target={`${NEXT_PUBLIC_URL}/frame/${params.slug}`}>
        Home
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
