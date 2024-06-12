"use server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_KEY;
const SECRET_ID = process.env.SPOTIFY_SECRET_KEY;

const songSearch = async (query: string) => {
  try {
    // Fetch the API token
    const apiTokenResponse = await fetch(
      `https://accounts.spotify.com/api/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${SECRET_ID}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!apiTokenResponse.ok) {
      throw new Error(`Failed to fetch token: ${apiTokenResponse.statusText}`);
    }

    const tokenData = await apiTokenResponse.json();
    const accessToken = tokenData.access_token;

    // Use the token to fetch the track data
    const trackResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=15`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!trackResponse.ok) {
      throw new Error(`Failed to fetch track: ${trackResponse.statusText}`);
    }

    const trackData = await trackResponse.json();

    // Extract track information from the response
    const tracks = trackData.tracks.items;

    return tracks;
  } catch (error) {
    throw error;
  }
};

export default songSearch;
