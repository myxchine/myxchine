"use server";

import ytdl from "ytdl-core";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import stream from "stream";
import { storage } from "@/app/firebase/config";

const downloadTrack = async (id: string, songid: string): Promise<string> => {
  const storageRef = ref(storage, `myxic_songs/${songid}.webm`);

  try {
    const ytdlStream = ytdl(`http://www.youtube.com/watch?v=${id}`, {
      quality: 251,
    });

    const passThroughStream = new stream.PassThrough();
    const chunks: Uint8Array[] = [];

    ytdlStream.pipe(passThroughStream);

    passThroughStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    await new Promise<void>((resolve, reject) => {
      passThroughStream.on("end", resolve);
      passThroughStream.on("error", reject);
    });

    const fileBuffer = Buffer.concat(chunks);

    const uploadTask = uploadBytesResumable(storageRef, fileBuffer, {
      contentType: "audio/webm",
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
        }
      );
    });

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error downloading or uploading video:", error);
    throw error;
  }
};

export default downloadTrack;
