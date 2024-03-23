export async function getCurrentlyPlaying(accessToken: string) {
  const url = "https://api.spotify.com/v1/me/player/currently-playing";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Handle the error case where the Spotify API returns a non-2xx HTTP status
      const errorDetail = await response.text();
      throw new Error(
        `Failed to fetch currently playing track: ${errorDetail}`
      );
    }

    const data = await response.json(); // Assuming the response is JSON-formatted
    return data; // Return the data for further processing
  } catch (error) {
    console.error("Error fetching currently playing track:", error);
  }
}

export async function exchangetoken(code: string): Promise<string[]> {
  try {
    const response = await fetch("/api/gettoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token exchange failed: ${errorData.error}`);
    }

    const data = await response.json();
    return [data.access_token, data.refresh_token, data.expires_in];
  } catch (error) {
    console.error("Error exchanging token:", error);
    return ["error", "error", "error"];
  }
}

// Usage example:
// getCurrentlyPlaying('your_spotify_access_token_here');
