"use client";

import { IoMdPlay, IoMdPause } from "react-icons/io";
import MyLoader from "@/components/ui/Loader";
import Image from "next/image";
import { useMusic } from "@/app/app/context";
import { useState, useEffect } from "react";

const MediaPlayer = () => {
  const {
    queue,
    currentIndex,
    isPlaying,
    live,
    play,
    pause,
    currentTime,
    duration,
    toggleFullScreen,
    songLoading,
  } = useMusic();

  const loadBarStyle = {
    width: `${(currentTime / duration) * 100}%`,
  };

  if (queue[currentIndex]) {
    return (
      <>
        <div className="w-full">
          <div className="p-2">
            <div
              className="rounded-lg"
              style={{
                background: queue[currentIndex].colour
                  ? queue[currentIndex].colour
                  : "#000",
                transition: "background 2s ease",
              }}
            >
              <div className=" px-2">
                <div className="flex flex w-full items-center justify-between space-x-3 py-2">
                  <div>
                    <Image
                      onClick={toggleFullScreen}
                      className="rounded-lg w-[60px]"
                      priority={true}
                      width={100}
                      height={100}
                      src={queue[currentIndex].images[1].url}
                      alt={`${queue[currentIndex].name} - Album Cover`}
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex h-full items-center align-middle">
                      <div
                        onClick={toggleFullScreen}
                        className="w-full text-left"
                      >
                        <div>
                          <h2
                            className="text-l truncate text-white"
                            style={{
                              maxWidth: "150px",
                            }}
                          >
                            {queue[currentIndex].name}
                          </h2>
                          <h3
                            className="truncate text-xs text-white text-opacity-80"
                            style={{
                              maxWidth: "150px",
                            }}
                          >
                            {queue[currentIndex].artists
                              ? queue[currentIndex].artists
                                  .map((artist: any) => artist.name)
                                  .join(", ")
                              : "MYXIC"}{" "}
                            - {queue[currentIndex].album}
                          </h3>
                        </div>
                      </div>
                      {songLoading && (
                        <div
                          className={`fade-in justify-right flex h-full items-center ${
                            songLoading ? "show" : ""
                          }`}
                        >
                          <MyLoader />
                        </div>
                      )}
                      {!songLoading && (
                        <button
                          className={`fade-in rounded pr-2 text-3xl text-white ${
                            !songLoading ? "show" : ""
                          }`}
                          onClick={isPlaying ? pause : play}
                        >
                          {isPlaying ? <IoMdPause /> : <IoMdPlay />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full rounded-full bg-white bg-opacity-50">
                  <div
                    className="h-full rounded-full bg-white bg-opacity-80"
                    style={loadBarStyle}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};
export default MediaPlayer;
