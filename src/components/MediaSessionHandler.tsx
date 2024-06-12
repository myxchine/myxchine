"use client";

import { useEffect } from "react";

interface Props {
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void; // Add handler for next button
  onPrevious?: () => void; // Add handler for previous button
}

const MediaSessionHandler: React.FC<Props> = ({
  onPlay,
  onPause,
  onNext,
  onPrevious,
}) => {
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        onPlay && onPlay();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        onPause && onPause();
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        onNext && onNext();
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        onPrevious && onPrevious();
      });
    }
  }, [onPlay, onPause, onNext, onPrevious]);

  return null;
};

export default MediaSessionHandler;
