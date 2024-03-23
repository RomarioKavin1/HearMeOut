import { NEXT_PUBLIC_URL } from "../../config"; // Assuming your config exports this variable

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <head>
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:button:1" content="Home" />
        <meta name="fc:frame:button:1:action" content="post" />
        <meta
          name="fc:frame:button:1:target"
          content={`${NEXT_PUBLIC_URL}/frame/1`}
        />
        <meta name="fc:frame:button:2" content="My stats" />
        <meta name="fc:frame:button:3" content="Get my playlist" />
        <meta name="fc:frame:button:4" content="Suggest songs" />
        <meta
          name="fc:frame:image"
          content={`${NEXT_PUBLIC_URL}/api/listeningframe?fid=${params.slug}`}
        />
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta name="fc:frame:input:text" content="Tell me a story" />
        <meta
          name="fc:frame:post_url"
          content={`${NEXT_PUBLIC_URL}/api/frame`}
        />
        <title>zizzamia.xyz</title>
        <meta name="description" content="LFG" />
        <meta property="og:title" content="zizzamia.xyz" />
        <meta property="og:description" content="LFG" />
        <meta property="og:image" content={`${NEXT_PUBLIC_URL}/park-1.png`} />
      </head>
      <h1>frame</h1>
    </div>
  );
}