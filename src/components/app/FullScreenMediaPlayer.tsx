import { useState, useRef, useEffect } from "react";
import {
  IoMdPlay,
  IoMdPause,
  IoMdSkipForward,
  IoMdSkipBackward,
} from "react-icons/io";
import { IoChevronBackOutline } from "react-icons/io5";
import MyLoader from "@/components/ui/Loader";
import Queue from "@/components/Queue";

interface MediaImage {
  src: string;
  sizes: string;
  type: string;
}

interface Song {
  url: string;
  metadata: {
    title: string;
    artist: string;
    album: string;
    artwork: Array<MediaImage>;
  };
}

interface FullScreenMediaPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  songLoading: boolean;
  timeRemaining: number;
  prominentColour: string;
  queue: Song[];
  onClose: () => void;
  onPlayPause: () => void;
  setCurrentTime: (newTime: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  changeSongPoint: (newPointInSeconds: number) => void;
  changeBackgroundColor: () => void;
}

const FullScreenMediaPlayer: React.FC<FullScreenMediaPlayerProps> = ({
  currentSong,
  isPlaying,
  currentTime,
  timeRemaining, // Include timeRemaining here
  duration,
  prominentColour,
  songLoading,
  queue,
  onClose,
  setCurrentTime,
  onPlayPause,
  onNext,
  onPrevious,
  changeBackgroundColor,
  changeSongPoint,
}) => {
  const [dragging, setDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="pointer-events-auto"
      style={{
        backgroundColor: prominentColour,
        transition: "background 2s ease",
      }}
    >
      <div
        className="z-1000000 h-screen"
        style={{
          // background: `radial-gradient(circle 1500px at 50% 30%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 30%, rgba(0, 0, 0, 0.6) 100%)`,
          background: `radial-gradient(circle 1500px at 50% 30%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 100%)`,
        }}
      >
        <div className="left-0 top-0 flex items-center p-2">
          <button
            style={{ transform: "rotate(-90deg)" }}
            className="pb-0 pr-4 pt-2 text-3xl text-white"
            onClick={() => onClose()}
          >
            <IoChevronBackOutline />
          </button>
        </div>
        <div className="max-h-screen w-full overflow-y-auto rounded-xl bg-opacity-0 p-4 pb-40">
          <div className="flex flex-col items-center space-y-4 bg-opacity-0">
            <div className="mb-4 bg-opacity-0">
              <img
                className="rounded-xl"
                width={"max"}
                src={currentSong.album.images[0].url}
                alt={`${currentSong.name} - Album Cover`}
              />
            </div>

            <div className="mt-0 w-full text-left">
              <h2
                className="truncate text-2xl font-bold text-white"
                style={{ maxWidth: "300px" }}
              >
                {currentSong.name}
              </h2>
              <h3
                className="truncate text-xl text-white text-opacity-60"
                style={{ maxWidth: "250px" }}
              >
                {currentSong.album.artists
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
            <div className="text-3xl text-black">{timeRemaining}</div>
            <div className="flex items-center justify-between space-x-8 py-4 text-white">
              <button
                className="rounded text-4xl"
                onClick={() => onPrevious(currentSong)}
              >
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
                  onClick={onPlayPause}
                >
                  {isPlaying ? <IoMdPause /> : <IoMdPlay />}
                </button>
              )}
              <button
                className="rounded text-4xl"
                onClick={() => onNext(currentSong)}
              >
                <IoMdSkipForward />
              </button>
            </div>
          </div>
          {queue.length > 0 && <Queue songs={queue} />}
        </div>
      </div>
    </div>
  );
};

export default FullScreenMediaPlayer;
