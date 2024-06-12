"use server";

import Vibrant from "node-vibrant";

export default async function getColour(song: Song) {
  const imageSrc = song.album.images[0].url;
  try {
    const palette = await Vibrant.from(imageSrc).getPalette();
    const vibrantColor = palette.Vibrant?.getHex();

    const darkerColor = changeBackgroundColor(vibrantColor);
    return darkerColor;
  } catch (error) {
    console.error("Error extracting color from image:", error);
  }
}

const changeBackgroundColor = (color: string) => {
  let hex = color;
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  let darkerR = Math.round(r * 0.5);
  let darkerG = Math.round(g * 0.5);
  let darkerB = Math.round(b * 0.5);
  let darkerHex =
    "#" +
    darkerR.toString(16).padStart(2, "0") +
    darkerG.toString(16).padStart(2, "0") +
    darkerB.toString(16).padStart(2, "0");

  return darkerHex;
};
