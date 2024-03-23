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
    console.log("Currently playing track data:", data);
    return data; // Return the data for further processing
  } catch (error) {
    console.error("Error fetching currently playing track:", error);
  }
}

// Usage example:
// getCurrentlyPlaying('your_spotify_access_token_here');
