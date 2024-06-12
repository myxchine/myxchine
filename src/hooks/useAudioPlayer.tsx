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
          console.log(queue[currentIndex]);
          setIsPlaying(true);
          setSongLoading(false);
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
