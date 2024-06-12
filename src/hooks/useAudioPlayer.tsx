import { useState, useRef, useEffect } from "react";

const useAudioPlayer = (initialSongs = []) => {
  const [queue, setQueue] = useState(initialSongs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Added state for current time
  const [duration, setDuration] = useState(0); // Added state for audio duration
  const [live, setLive] = useState(false);

  const audioRef = useRef(new Audio(queue[0]?.url));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = queue[currentIndex]?.url || "";
    }
  }, [currentIndex, queue]); // Removed isPlaying from dependencies to prevent unnecessary resets

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.src = queue[currentIndex]?.url || "";
    audio
      .play()
      .then(() => {
        // Audio playback has started
        console.log(queue[currentIndex]);
        setLive(true);
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });

    return () => {
      audio.pause(); // Pause the audio when the component unmounts or this effect runs again
    };
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
    live,
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
