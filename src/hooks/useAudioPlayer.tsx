"use client";

import { useState, useRef, useEffect } from "react";

const useAudioPlayer = (initialSongs = []) => {
  const [queue, setQueue] = useState(initialSongs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songLoading, setSongLoading] = useState(false);
  const audioRef = useRef(null);

  const setMediaSession = (song) => {
    console.log("Setting media session for song:", song);
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: song.name,
        artist: song.artists.map((artist) => artist.name).join(", "),
        album: song.album, // Assuming album is an object with a name property
        artwork: [
          {
            src: song.images[0].url, // Adjusting to the correct path for image URL
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      // Set action handlers
      navigator.mediaSession.setActionHandler("play", play);
      navigator.mediaSession.setActionHandler("pause", pause);
      navigator.mediaSession.setActionHandler("previoustrack", prev);
      navigator.mediaSession.setActionHandler("nexttrack", next);
    }
  };

  useEffect(() => {
    if (audioRef.current && queue.length > 0) {
      setSongLoading(true);
      const audio = new Audio(queue[currentIndex]?.url || "");
      audioRef.current = audio;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setSongLoading(false);
          setMediaSession(queue[currentIndex]);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });

      return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [queue, currentIndex]);

  const play = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % queue.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + queue.length) % queue.length
    );
  };

  const setSongAndPlay = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  return {
    currentSong: queue[currentIndex],
    currentIndex,
    isPlaying,
    currentTime,
    songLoading,
    duration,
    queue,
    play,
    pause,
    next,
    prev,
    setQueue,
    setCurrentIndex,
    setSongAndPlay,
    audioRef,
  };
};

export default useAudioPlayer;
