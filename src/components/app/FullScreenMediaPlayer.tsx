"use client";

import {
  IoMdPlay,
  IoMdPause,
  IoMdSkipForward,
  IoMdSkipBackward,
} from "react-icons/io";
import { IoChevronBackOutline } from "react-icons/io5";
import MyLoader from "@/components/ui/Loader";
import Queue from "@/components/Queue";
import { useMusic } from "@/app/app/context";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FullScreenMediaPlayer = () => {
  const [dragging, setDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const {
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    songLoading,
    queue,
    closeFullscreen,
    setCurrentTime,
    isFullScreen,
    play,
    pause,
    next,
    prev,
    changeBackgroundColor,
    changeSongPoint,
  } = useMusic();

  const onStartDrag = () => {
    setDragging(true);
  };

  const onStopDrag = () => {
    setDragging(false);
  };

  const onMove = (event: MouseEvent | TouchEvent) => {
    if (!progressBarRef.current || !dragging) return;

    const { left, width } = progressBarRef.current.getBoundingClientRect();
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - left;
    let newTime = (offsetX / width) * duration;
    newTime = Math.max(0, Math.min(duration, newTime));
    changeSongPoint(newTime);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onStopDrag);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onStopDrag);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onStopDrag);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onStopDrag);
    };
  }, [dragging]);

  const loadBarStyle = {
    width: `${(currentTime / duration) * 100}%`,
  };

  const circleStyle = {
    left: `${(currentTime / duration) * 100}%`,
  };

  if (isFullScreen) {
    return (
      <div
        className="fixed top-0 left-0 w-full z-10000000000"
        style={{
          backgroundColor: queue[currentIndex].colour,
          transition: "background 2s ease",
        }}
      >
        <div className="left-0 top-0 flex items-center p-2">
          <button
            style={{ transform: "rotate(-90deg)" }}
            className="pb-0 pr-4 pt-2 text-3xl text-white"
            onClick={() => closeFullscreen()}
          >
            <IoChevronBackOutline />
          </button>
        </div>
        <div className="max-h-screen w-full overflow-y-auto rounded-xl bg-opacity-0 p-4 pb-40">
          <div className="flex flex-col items-center space-y-4 bg-opacity-0">
            <div className="mb-4 bg-opacity-0">
              <Image
                className="rounded w-full h-auto "
                width={500}
                height={500}
                priority
                src={queue[currentIndex].images[0].url}
                alt={`${queue[currentIndex].name} - Album Cover`}
              />
            </div>

            <div className="mt-0 w-full text-left">
              <h2
                className="truncate text-2xl font-bold text-white"
                style={{ maxWidth: "300px" }}
              >
                {queue[currentIndex].name}
              </h2>
              <h3
                className="truncate text-xl text-white text-opacity-60"
                style={{ maxWidth: "250px" }}
              >
                {queue[currentIndex].artists
                  .map((artist: any) => artist.name)
                  .join(", ")}
              </h3>
            </div>
            <div
              ref={progressBarRef}
              className="relative h-2 w-full rounded-full bg-white bg-opacity-30"
              onMouseDown={onStartDrag}
              onTouchStart={onStartDrag}
            >
              <div
                className="h-full rounded-full bg-white"
                style={loadBarStyle}
              ></div>
              <div
                className="absolute top-1 h-5 w-2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded bg-white bg-opacity-100"
                style={circleStyle}
              ></div>
            </div>
            <div className="flex items-center justify-between space-x-8 py-4 text-white">
              <button className="rounded text-4xl" onClick={() => prev()}>
                <IoMdSkipBackward />
              </button>
              {songLoading && (
                <div
                  className={`fade-in justify-right flex h-20 h-full w-20 items-center ${
                    songLoading ? "show" : ""
                  }`}
                >
                  <MyLoader />
                </div>
              )}
              {!songLoading && (
                <button
                  className={`rounded text-5xl ${!songLoading ? "show" : ""}`}
                  onClick={isPlaying ? pause : play}
                >
                  {isPlaying ? <IoMdPause /> : <IoMdPlay />}
                </button>
              )}
              <button className="rounded text-4xl" onClick={() => next()}>
                <IoMdSkipForward />
              </button>
            </div>
          </div>
          {queue.length > 0 && <Queue songs={queue} />}
        </div>
      </div>
    );
  }
};

export default FullScreenMediaPlayer;
