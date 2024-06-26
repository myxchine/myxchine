"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSongs, getAlbums, getPlaylists } from "@/server/utils";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useAuth } from "@/app/context";
import MediaSessionHandler from "@/components/MediaSessionHandler";

interface MusicContextType {
  musicData: any;
  queue: any[];
  currentTime: number;
  duration: number;
  currentIndex: number;
  isPlaying: boolean;
  isFullScreen: boolean;
  songLoading: boolean;
  randomSongs: any[]; // Added randomSongs state
  randomAlbums: any[]; // Added randomAlbums state
  openFullscreen: () => void;
  closeFullscreen: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  getClientAlbums: (limit: number) => void;
  addToQueue: (song: any) => void;
  setQueue: (songs: any[]) => void;
  setCurrentIndex: (index: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  const [musicData, setMusicData] = useState({
    songs: null,
    albums: null,
    playlists: null,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [randomSongs, setRandomSongs] = useState([]); // State for randomSongs
  const [randomAlbums, setRandomAlbums] = useState([]); // State for randomAlbums

  const {
    currentIndex,
    queue,
    songLoading,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    next,
    prev,
    setQueue,
    setCurrentIndex,
    audioRef,
  } = useAudioPlayer();

  useEffect(() => {
    console.log("user", user);
    if (user) {
      getSongs(30)
        .then((data) => {
          setMusicData((prev) => ({ ...prev, songs: data.data }));
          setRandomSongs(
            data.data.sort(() => 0.5 - Math.random()).slice(0, 10)
          ); // Set random songs
        })
        .catch((error) => {
          console.error("Error fetching songs:", error);
        });

      getAlbums(15)
        .then((data) => {
          setMusicData((prev) => ({ ...prev, albums: data.data }));
          setRandomAlbums(
            data.data.sort(() => 0.5 - Math.random()).slice(0, 10)
          ); // Set random albums
        })
        .catch((error) => {
          console.error("Error fetching albums:", error);
        });

      getPlaylists(10, user.id)
        .then((data) => {
          console.log("playlists", data);
          setMusicData((prev) => ({ ...prev, playlists: data }));
        })
        .catch((error) => {
          console.error("Error fetching playlists:", error);
        });
    }

    if (!user) {
      router.push("/signin");
    }
  }, [user]);

  useEffect(() => {
    if (isFullScreen) {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", queue[currentIndex]?.colour);
    }

    if (!isFullScreen) {
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", "#FFF");
    }
  }, [currentIndex, queue, isFullScreen]);

  const addToQueue = (song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
  };

  const getClientAlbums = async (limit: number) => {
    const data = await getAlbums(limit);
    setMusicData((prev) => ({ ...prev, albums: data }));
  };

  const openFullscreen = () => {
    setIsFullScreen(true);
  };

  const closeFullscreen = () => {
    setIsFullScreen(false);
  };

  return (
    <MusicContext.Provider
      value={{
        musicData,
        currentTime,
        duration,
        currentIndex,
        queue,
        isPlaying,
        isFullScreen,
        songLoading,
        randomSongs, // Providing randomSongs state
        randomAlbums, // Providing randomAlbums state
        play,
        pause,
        next,
        openFullscreen,
        closeFullscreen,
        prev,
        setQueue,
        getClientAlbums,
        addToQueue,
        setCurrentIndex,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} />
      <MediaSessionHandler
        onPlay={play}
        onPause={pause}
        onNext={next}
        onPrevious={prev}
      />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
