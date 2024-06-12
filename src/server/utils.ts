"use server";

import { db } from "./db";
import getColour from "@/utils/vibrant";

export const createNewSong = async (song: any, url: string) => {
  try {
    const { data, error } = await db
      .from("songs")
      .insert([
        {
          id: song.id,
          name: song.name,
          colour: await getColour(song),
          albumId: song.album.id,
          album: song.album.name,
          artists: song.album.artists,
          images: song.album.images,
          url,
          uploadedBy: "myxic",
          created_at: new Date(),
        },
      ])
      .select("*"); // Use select to return the inserted records

    if (error) {
      throw error;
    }

    return data[0]; // Return the first record in the inserted data
  } catch (error) {
    console.error("Error creating new song:", error);
    throw error;
  }
};

export const getAlbumSongs = async (albumId: string) => {
  try {
    const data = await db
      .from("songs")
      .select("*")
      .eq("albumId", albumId)
      .order("created_at", { ascending: false })
      .limit(100);

    return data;
  } catch (error) {
    console.error("Error getting album songs:", error);
    throw error;
  }
};

export const getSongs = async (limit: number) => {
  try {
    const data = await db
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAlbums = async (limit: number) => {
  try {
    const data = await db
      .from("albums")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    return data;
  } catch (error) {
    console.error("Error fetching albums:", error);
    throw error;
  }
};

export const getPlaylists = async (limit: number, userId: string) => {
  try {
    const data = await db
      .from("playlists")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    return data;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

export const checkSongExists = async (id: string) => {
  try {
    const data = await db.from("songs").select("*").eq("id", "==", id).limit(1);

    if (data.length === 0) {
      return "not on database";
    } else {
      return data[0];
    }
  } catch (error) {
    console.error("Error checking song exists:", error);
    throw error;
  }
};

export const checkAlbumExists = async (id: string) => {
  try {
    const data = await db
      .from("albums")
      .select("*")
      .eq("id", "==", id)
      .limit(1);

    if (data.length === 0) {
      return "not on database";
    } else {
      return data[0];
    }
  } catch (error) {
    console.error("Error checking album exists:", error);
    throw error;
  }
};

export const checkPlaylistExists = async (id: string) => {
  try {
    const data = await db
      .from("playlists")
      .select("*")
      .eq("id", "==", id)
      .limit(1);

    if (data.length === 0) {
      return "not on database";
    } else {
      return data[0];
    }
  } catch (error) {
    console.error("Error checking playlist exists:", error);
    throw error;
  }
};

export const addSongToAlbum = async (albumID: string, song: any) => {
  try {
    const data = await db.from("songs").eq("id", "==", song.id).update({
      album_id: albumID,
    });

    return data;
  } catch (error) {
    console.error("Error adding song to album:", error);
    throw error;
  }
};

export const getSong = async (id: string) => {
  try {
    const data = await db.from("songs").select("*").eq("id", "==", id).limit(1);

    if (data.length === 0) {
      return "not on database";
    } else {
      return data[0];
    }
  } catch (error) {
    console.error("Error getting song:", error);
    throw error;
  }
};

export const getAlbum = async (id: string) => {
  try {
    const data = await db
      .from("albums")
      .select("*")
      .eq("id", "==", id)
      .limit(1);

    if (data.length === 0) {
      return "not on database";
    } else {
      return data[0];
    }
  } catch (error) {
    console.error("Error getting album:", error);
    throw error;
  }
};

export const getPlaylist = async (limit, id: string) => {
  try {
    const data = await db
      .from("playlists")
      .select("*")
      .eq("userId", id)
      .limit(1);

    if (data.length === 0) {
      return "not on database";
    } else {
      return data[0];
    }
  } catch (error) {
    console.error("Error getting playlist:", error);
    throw error;
  }
};

export const getPlaylistSongs = async (id: string) => {
  try {
    const data = await db
      .from("songs")
      .select("*")
      .eq("playlist_id", "==", id)
      .order("created_at", { ascending: false })
      .limit(100);

    return data;
  } catch (error) {
    console.error("Error getting playlist songs:", error);
    throw error;
  }
};

export const getArtistSongs = async (id: string) => {
  try {
    const data = await db
      .from("songs")
      .select("*")
      .eq("artist_id", "==", id)
      .order("created_at", { ascending: false })
      .limit(100);

    return data;
  } catch (error) {
    console.error("Error getting artist songs:", error);
    throw error;
  }
};

export const getArtistAlbums = async (id: string) => {
  try {
    const data = await db
      .from("albums")
      .select("*")
      .eq("artist_id", "==", id)
      .order("created_at", { ascending: false })
      .limit(100);

    return data;
  } catch (error) {
    console.error("Error getting artist albums:", error);
    throw error;
  }
};

export const createNewAlbum = async (album: any) => {
  try {
    const { data: existingAlbums, error: selectError } = await db
      .from("albums")
      .select("*")
      .eq("id", album.id);

    if (selectError) {
      console.error("Error checking for existing album:", selectError);
      throw selectError;
    }

    if (existingAlbums && existingAlbums.length > 0) {
      return existingAlbums[0];
    }

    const { data: newAlbum, error: insertError } = await db
      .from("albums")
      .insert({
        id: album.id,
        name: album.name,
        images: album.images,
        artists: album.artists,
      })
      .single(); // This will ensure we get the inserted record back

    if (insertError) {
      console.error("Error creating new album:", insertError);
      throw insertError;
    }

    console.log("New album created:", newAlbum);

    return newAlbum;
  } catch (error) {
    console.error("Error in createNewAlbum:", error);
    throw error;
  }
};

export const createPlaylist = async (playlist: any) => {
  try {
    const { data: existingPlaylists, error: selectError } = await db
      .from("playlists")
      .select("*")
      .eq("id", playlist.id);

    if (selectError) {
      console.error("Error checking for existing playlist:", selectError);
      throw selectError;
    }

    if (existingPlaylists && existingPlaylists.length > 0) {
      return existingPlaylists[0];
    }

    const { data: newPlaylist, error: insertError } = await db
      .from("playlists")
      .insert({
        id: playlist.id,
        name: playlist.name,
        userId: playlist.userId,
      })
      .single(); // This will ensure we get the inserted record back

    if (insertError) {
      console.error("Error creating new playlist:", insertError);
      throw insertError;
    }

    console.log("New playlist created:", newPlaylist);

    return newPlaylist;
  } catch (error) {
    console.error("Error in createPlaylist:", error);
    throw error;
  }
};

export const addSongToPlaylist = async (playlistID: string, song: any) => {
  try {
    const { data: existingSongs, error: selectError } = await db
      .from("songs")
      .select("*")
      .eq("id", song.id);

    if (selectError) {
      console.error("Error checking for existing song:", selectError);
      throw selectError;
    }

    if (existingSongs && existingSongs.length > 0) {
      return existingSongs[0];
    }

    const { data: newSong, error: insertError } = await db
      .from("songs")
      .insert({
        id: song.id,
        playlist_id: playlistID,
      })
      .single(); // This will ensure we get the inserted record back

    if (insertError) {
      console.error("Error adding song to playlist:", insertError);
      throw insertError;
    }

    console.log("New song added to playlist:", newSong);

    return newSong;
  } catch (error) {
    console.error("Error in addSongToPlaylist:", error);
    throw error;
  }
};