"use server";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  doc,
  queryEqual,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import vibrant from "~/utils/vibrant";

import app from "./config";

const db = getFirestore(app);
const storage = getStorage(app);

export const deleteSong = async (songId: string) => {
  try {
    const songsCollection = collection(db, "songs");
    const q = query(songsCollection, where("id", "==", songId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No song found with ID:", songId);
      return;
    }

    // Assuming each song ID is unique and only one document will be found
    const songDoc = querySnapshot.docs[0];

    // Delete the document from Firestore
    await deleteDoc(doc(db, "songs", songDoc.id));
    console.log("Song document deleted successfully:", songId);

    // Retrieve the URL of the song file
    const songData = songDoc.data();
    const songUrl = songData.url;

    // Delete the file from Firebase Storage
    const songRef = ref(storage, songUrl);
    await deleteObject(songRef);
    console.log("Song file deleted successfully:", songUrl);

    // Delete the song from its respective album
    const albumId = songData.album.id;
    if (albumId) {
      const albumsCollection = collection(db, "albums");
      const q = query(albumsCollection, where("id", "==", albumId));
      const querySnapshot = await getDocs(q);
      const albumDoc = querySnapshot.docs[0];
      const albumRef = albumDoc.ref; // get the reference to the album document

      if (albumDoc.exists()) {
        const albumData = albumDoc.data();
        const songs = albumData.songs.filter((song) => song.id !== songId);
        await updateDoc(albumRef, { songs });
        if (songs.length === 0) {
          // Album is now empty, delete the album document
          await deleteDoc(albumRef);
          console.log("Album deleted successfully:", albumId);
        } else {
          console.log("Song deleted from album successfully:", albumId);
        }
      }
    }
  } catch (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
};

export const getAllSongs = async () => {
  const songsCollection = collection(db, "songs");
  const querySnapshot = await getDocs(songsCollection);
  const songs = [];
  querySnapshot.forEach((doc) => {
    songs.push({ id: doc.id, ...doc.data() });
  });
  return songs;
};

export const getAllAlbums = async () => {
  const albumsCollection = collection(db, "albums");
  const querySnapshot = await getDocs(albumsCollection);
  const albums = [];
  querySnapshot.forEach((doc) => {
    albums.push({ id: doc.id, ...doc.data() });
  });
  return albums;
};

export const getallPlaylists = async (userDataID: string) => {
  console.log("userDataID", userDataID);
  const albumsCollection = collection(db, "playlists");
  const q = query(
    albumsCollection,
    where("metadata.createdBy", "==", userDataID),
  );
  const querySnapshot = await getDocs(q);
  const albums = [];
  querySnapshot.forEach((doc) => {
    albums.push({ id: doc.id, ...doc.data() });
  });
  return albums;
};

export const getRandomAlbums = async (numberOfAlbums: number) => {
  const albumsCollection = collection(db, "albums");
  const albumsRef = await getDocs(albumsCollection);

  // Shuffle the albums array randomly
  const shuffledAlbums = albumsRef.docs.sort(() => Math.random() - 0.5);

  // Take the first 'numberOfAlbums' albums from the shuffled array
  const randomAlbums = shuffledAlbums
    .slice(0, numberOfAlbums)
    .map((doc) => ({ id: doc.id, ...doc.data() }));

  return randomAlbums;
};

export const getAlbum = async (albumId: string) => {
  const songsCollection = collection(db, "songs");
  const q = query(songsCollection, where("album.id", "==", albumId));
  const querySnapshot = await getDocs(q);
  const songs = [];
  querySnapshot.forEach((doc) => {
    songs.push({ id: doc.id, ...doc.data() });
  });
  return songs;
};

export const getRecentAlbums = async (numberOfAlbums: number) => {
  try {
    const songsCollection = collection(db, "albums");
    const recentSongsQuery = query(
      songsCollection,
      orderBy("timestamp", "desc"),
      limit(numberOfAlbums),
    );
    const querySnapshot = await getDocs(recentSongsQuery);
    const songs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("recent albums", songs);
    return songs;
  } catch (error) {
    console.error("Error fetching recent albums:", error);
    return [];
  }
};

export const getRecentSongs = async (numberOfSongs: number) => {
  try {
    const songsCollection = collection(db, "songs");
    const recentSongsQuery = query(
      songsCollection,
      orderBy("timestamp", "desc"),
      limit(numberOfSongs),
    );
    const querySnapshot = await getDocs(recentSongsQuery);
    const songs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("recent songs", songs);
    return songs;
  } catch (error) {
    console.error("Error fetching recent songs:", error);
    return [];
  }
};

export const getRandomSongs = async (numberOfSongs: number) => {
  const albumsCollection = collection(db, "songs");
  const albumsRef = await getDocs(albumsCollection);

  // Shuffle the albums array randomly
  const shuffledAlbums = albumsRef.docs.sort(() => Math.random() - 0.5);

  // Take the first 'numberOfAlbums' albums from the shuffled array
  const randomAlbums = shuffledAlbums
    .slice(0, numberOfSongs)
    .map((doc) => ({ id: doc.id, ...doc.data() }));

  return randomAlbums;
};

export const checkSongExists = async (songId: string): Promise<any> => {
  try {
    const songsCollection = collection(db, "songs");
    const q = query(songsCollection, where("id", "==", songId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return "not on database";
    }

    const songData = querySnapshot.docs[0].data();
    console.log("songData", songData);

    return songData;
  } catch (error) {
    console.error("Error checking song:", error);
    throw error;
  }
};

export const checkAlbumExists = async (
  albumId: string,
): Promise<string | null> => {
  try {
    const albumsCollection = collection(db, "albums");
    const q = query(albumsCollection, where("id", "==", albumId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return "not on database"; // Album not found
    }

    // Return the ID of the first matching document
    return querySnapshot.docs[0].id;
  } catch (error) {
    console.error("Error checking album:", error);
    throw error;
  }
};
export const getSong = async (songId: string): Promise<string | null> => {
  try {
    const songsCollection = collection(db, "songs");
    const q = query(songsCollection, where("id", "==", songId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No matching song found
      return null;
    }

    // Extract the song URL from the first document in the query snapshot
    const songData = querySnapshot.docs[0].data();

    return songData;
  } catch (error) {
    console.error("Error fetching song URL:", error);
    return null;
  }
};

export const addSongToPlaylist = async (playlistId: string, song: Song) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);

    // Update the playlist document by appending the new song to the songs array
    await updateDoc(playlistRef, {
      songs: arrayUnion(song),
    });

    console.log("Song added to playlist successfully.");
    return true;
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return false;
  }
};

export const createNewPlaylist = async (details: Playlist) => {
  const playlist = {
    songs: [],
    metadata: {
      timestamp: new Date().toISOString(),

      createdBy: details.metadata.createdBy,
      playlist: details.metadata.playlist,

      artwork: [
        {
          src: details.metadata.artwork[0].src,
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  };

  console.log(playlist);

  await handleAddPlaylist(playlist);

  return playlist;
};

export const addSongToAlbum = async (albumId: string, song: Song) => {
  try {
    const albumRef = doc(db, "albums", albumId);

    // Update the playlist document by appending the new song to the songs array
    const update = await updateDoc(albumRef, {
      songs: arrayUnion(song),
    });

    console.log("Song added to playlist successfully.");
    return true;
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return false;
  }
};

export const createNewAlbum = async (details: Album): Promise<string> => {
  try {
    const albumObj = {
      songs: [],
      timestamp: new Date().toISOString(),
      ...details,
    };

    // Add the album to Firestore
    const docRef = await handleAddAlbum(albumObj);

    // Return the ID of the newly created album document
    return docRef; // This should return the ID of the document
  } catch (error) {
    console.error("Error creating album:", error);
    throw new Error(`Failed to create album: ${error.message}`);
  }
};

const handleAddPlaylist = async (newPlaylist: Playlist) => {
  console.log("running");
  try {
    // Get a reference to the "songs" collection
    const songsCollection = collection(db, "playlists");

    // Add a new document to the "songs" collection
    await addDoc(songsCollection, newPlaylist);

    console.log("Playlist added successfully.");
  } catch (error) {
    console.error("Error adding song: ", error);
  }
};

const handleAddAlbum = async (newAlbum: Album) => {
  console.log("running");
  try {
    // Get a reference to the "songs" collection
    const songsCollection = collection(db, "albums");

    // Add a new document to the "songs" collection
    const doc = await addDoc(songsCollection, newAlbum);
    return doc.id;
  } catch (error) {
    console.error("Error adding song: ", error);
  }
};

export const createNewSong = async (
  song: TrackInfo,
  url: string,
  duration: number,
) => {
  const colour = await vibrant(song);
  const songObj = {
    ...song,
    colour: colour,
    url: url,
    duration: duration,
    timestamp: new Date().toISOString(),
  };
  return songObj;
};

export const handleAddSong = async (newSong: Song) => {
  console.log("running");
  try {
    // Get a reference to the "songs" collection
    const songsCollection = collection(db, "songs");

    // Add a new document to the "songs" collection
    await addDoc(songsCollection, newSong);

    console.log("Song added successfully.");
  } catch (error) {
    console.error("Error adding song: ", error);
  }
};

export const addColourToSong = async (songId, colour) => {
  try {
    const songsCollection = collection(db, "songs");
    const q = query(songsCollection, where("id", "==", songId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No song found with ID:", songId);
      return;
    }

    // Assuming each song ID is unique and only one document will be found
    const songDoc = querySnapshot.docs[0];

    // Update the document with the new "colour" field
    await updateDoc(doc(db, "songs", songDoc.id), {
      colour: colour,
    });

    console.log("Colour added successfully to song:", songId);
  } catch (error) {
    console.error("Error adding colour to song:", error);
    throw error;
  }
};

export const updateSongFieldInAlbum = async (
  albumId,
  songId,
  fieldName,
  newValue,
) => {
  try {
    // Reference to the song document
    const songDocRef = doc(db, "songs", songId);

    // Fetch the song document
    const songDoc = await getDoc(songDocRef);

    if (!songDoc.exists()) {
      console.error("No song found with ID:", songId);
      return;
    }

    // Update the specific field of the song document
    await updateDoc(songDocRef, {
      [`metadata.${fieldName}`]: newValue,
    });

    console.log("Song field updated successfully:", fieldName, newValue);

    // Reference to the album document
    const albumDocRef = doc(db, "albums", albumId);

    // Fetch the album document
    const albumDoc = await getDoc(albumDocRef);

    if (!albumDoc.exists()) {
      console.error("No album found with ID:", albumId);
      return;
    }

    const albumData = albumDoc.data();
    const updatedSongs = albumData.songs.map((song) => {
      if (song.metadata.id === songId) {
        return {
          ...song,
          metadata: {
            ...song.metadata,
            [fieldName]: newValue,
          },
        };
      }
      return song;
    });

    // Update the album's song list with the modified song
    await updateDoc(albumDocRef, {
      songs: updatedSongs,
    });

    console.log("Album's song list updated successfully.");
  } catch (error) {
    console.error("Error updating song field:", error);
    throw error;
  }
};

export const deleteAlbum = async (albumId: string) => {
  try {
    const albumsCollection = collection(db, "albums");
    const albumQuery = query(albumsCollection, where("id", "==", albumId));
    const albumSnapshot = await getDocs(albumQuery);

    if (albumSnapshot.empty) {
      console.error("No album found with ID:", albumId);
      return;
    }

    const albumDoc = albumSnapshot.docs[0];
    const albumRef = albumDoc.ref;

    /*    const albumData = albumDoc.data();

    // Delete all songs in the album
    if (albumData.songs && albumData.songs.length > 0) {
      for (const song of albumData.songs) {
        // Delete song document from Firestore
        await deleteDoc(doc(db, "songs", song.id));
        console.log("Song document deleted successfully:", song.id);

        // Delete the song file from Firebase Storage
        const songRef = ref(storage, song.url);
        await deleteObject(songRef);
        console.log("Song file deleted successfully:", song.url);
      }
    }

    */

    // Delete the album document from Firestore
    await deleteDoc(albumRef);
    console.log("Album document deleted successfully:", albumId);
  } catch (error) {
    console.error("Error deleting album:", error);
    throw error;
  }
};
