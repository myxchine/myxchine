"use server";

// Function to search for a music video on YouTube
export default async function searchMusicVideo(
  songName: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(songName)}&key=${process.env.YOUTUBE_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch music video: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.items.length === 0) {
      throw new Error("No music video found for the given song.");
    }

    return data;
  } catch (error) {
    console.error("Error searching for music video:", error);
    return null;
  }
}
