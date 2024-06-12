// lib/downloadTrack.ts
"use server";

import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import stream from "stream";
import app from "~/app/firebase/config";
const storage = getStorage(app);

const downloadTrack = async (id: string, songid: string): Promise<string> => {
  const storageRef = ref(storage, `test/${songid}.mp3`);

  try {
    const ytdlStream = ytdl(`http://www.youtube.com/watch?v=${id}`, {
      quality: "lowestaudio",
    });

    const ffStream = ffmpeg(ytdlStream)
      .audioBitrate(128)
      .format("mp3")
      .on("error", (err) => {
        throw new Error(`FFmpeg error: ${err.message}`);
      });

    const passThroughStream = new stream.PassThrough();

    ffStream.pipe(passThroughStream);

    const chunks: Uint8Array[] = [];

    passThroughStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    await new Promise<void>((resolve, reject) => {
      passThroughStream.on("end", resolve);
      passThroughStream.on("error", reject);
    });

    const fileBuffer = Buffer.concat(chunks);

    const uploadTask = uploadBytesResumable(storageRef, fileBuffer, {
      contentType: "audio/mp3",
      cacheControl: "public, max-age=31536000",
    });

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          reject(error);
        },
        () => {
          resolve();
        },
      );
    });

    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    console.error("Error downloading or uploading video:", error);
    throw new Error(`Failed to download and upload track: ${error.message}`);
  }
};

export default downloadTrack;
