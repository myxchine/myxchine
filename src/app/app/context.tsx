"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSongs, getAlbums, getPlaylists } from "@/server/utils";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useAuth } from "@/app/context";

interface MusicContextType {
  musicData: any;
  queue: any[];
  currentTime: number;
  duration: number;
  currentIndex: number;
  isPlaying: boolean;
  isFullScreen: boolean;
  songLoading: boolean;
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
  const { user, session } = useAuth();

  const [musicData, setMusicData] = useState({
    songs: null,
    albums: null,
    playlists: null,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);

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
    if (user && session) {
      getSongs(10)
        .then((data) => {
          setMusicData((prev) => ({ ...prev, songs: data.data }));
        })
        .catch((error) => {
          console.error("Error fetching songs:", error);
        });

      getAlbums(10)
        .then((data) => {
          setMusicData((prev) => ({ ...prev, albums: data }));
        })
        .catch((error) => {
          console.error("Error fetching albums:", error);
        });

      getPlaylists(10, user.id)
        .then((data) => {
          setMusicData((prev) => ({ ...prev, playlists: data }));
        })
        .catch((error) => {
          console.error("Error fetching playlists:", error);
        });
    }
  }, [user, session]);

  const addToQueue = (song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
  };

  const getClientAlbums = async (limit: number) => {
    const data = await getAlbums(limit);

    setMusicData((prev) => ({ ...prev, albums: data }));
  };

  const openFullscreen = () => {
    console.log("open fullscreen");
    setIsFullScreen(true);
    console.log("isFullScreen", isFullScreen);
  };

  const closeFullscreen = () => {
    console.log("close fullscreen");
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
