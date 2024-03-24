export async function getCurrentlyPlaying(accessToken: string) {
  const url = "https://api.spotify.com/v1/me/player/currently-playing";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response is ok and has content
    if (response.ok && response.status !== 204) {
      const data = await response.json(); // Assuming the response is JSON-formatted
      return data; // Return the data for further processing
    } else {
      // Handle no content or other non-success responses
      console.log(
        `No currently playing track or unexpected response status: ${response.status}`
      );
      // Return a default object or null to indicate no data
      return null;
    }
  } catch (error) {
    console.error("Error fetching currently playing track:", error);
    // Return null or default object to indicate an error/failure
    return null;
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
interface SpotifyArtist {
  // Define the artist properties you need, e.g., name, id, genres, etc.
  name: string;
  id: string;
  genres: string[];
  // Add more properties as needed
}
export async function fetchSpotifyUserData(accessToken: string) {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Spotify user data:", error);
    return null; // Return null in case of an error
  }
}
async function getTopArtists(
  accessToken: string,
  timeRange: string = "medium_term",
  limit: number = 20,
  offset: number = 0
): Promise<SpotifyArtist[]> {
  const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Spotify API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.items; // Assuming the response structure contains an 'items' array
  } catch (error) {
    console.error("Failed to fetch top artists:", error);
    throw error;
  }
}

interface SpotifyTrack {
  name: string;
  id: string;
  artists: { name: string; id: string }[];
  album: string;
}

async function getTopTracks(
  accessToken: string,
  timeRange: string = "medium_term",
  limit: number = 20,
  offset: number = 0
): Promise<SpotifyTrack[]> {
  const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Spotify API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.items; // Assuming the response structure contains an 'items' array
  } catch (error) {
    console.error("Failed to fetch top tracks:", error);
    throw error;
  }
}
