"use client";

import { useMusic } from "@/app/app/context";
export default function getAlbum(albumId: string) {
  const { musicData } = useMusic();
  const albums = musicData.albums;

  const album = albums.find((album) => album.id === albumId);
  return album;
}
