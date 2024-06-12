"use server";

// Function to search for a music video on YouTube
export async function getDuration(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.YOUTUBE_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch music video: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.items.length === 0) {
      throw new Error("No music video found for the given song.");
    }

    const duration = durationToMilliseconds(
      data.items[0].contentDetails.duration,
    );

    return duration;
  } catch (error) {
    console.error("Error searching for music video:", error);
    return null;
  }
}

function durationToMilliseconds(duration) {
  // Parse the duration string
  const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  // Extract hours, minutes, and seconds
  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

  // Calculate total duration in seconds
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  // Convert total duration to milliseconds
  const totalMilliseconds = totalSeconds * 1000;

  return totalMilliseconds;
}
