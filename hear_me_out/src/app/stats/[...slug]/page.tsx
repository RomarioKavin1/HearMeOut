import { NEXT_PUBLIC_URL } from "../../config"; // Assuming your config exports this variable

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <head>
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:button:1" content="Now Listening" />
        <meta name="fc:frame:button:1:action" content="post" />
        <meta
          name="fc:frame:button:1:target"
          content={`${NEXT_PUBLIC_URL}/nowlistening/${params.slug}`}
        />
        <meta name="fc:frame:button:2" content="Home" />
        <meta name="fc:frame:button:2:action" content="post" />
        <meta
          name="fc:frame:button:2:target"
          content={`${NEXT_PUBLIC_URL}/frame/${params.slug}`}
        />
        <meta name="fc:frame:button:3" content="Get my playlist" />
        <meta
          name="fc:frame:image"
          content={`${NEXT_PUBLIC_URL}/api/statsframe?fid=${params.slug}`}
        />
        <meta name="fc:frame:image:aspect_ratio" content="1.91:1" />
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
