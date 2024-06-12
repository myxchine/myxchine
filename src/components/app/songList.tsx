import { IoMdAdd } from "react-icons/io";
import Image from "next/image";

interface Song {
  id: string;
  name: string;
  album: string;
  artists: { id: string; name: string }[];
  images: { url: string }[];
  url: string;
}

interface Props {
  data: Song[];
  setSong: (song: Song) => void;
  addToQueue: (song: Song) => void;
  headerText: string;
  limit: number;
  showImage: boolean;
  randomize: boolean; // Add new prop for randomizing
}

const SongsList: React.FC<Props> = ({
  data = [],
  limit,
  setSong,
  addToQueue,
  headerText,
  showImage,
  randomize, // Destructure the new prop
}) => {
  if (!data) {
    return (
      <div className="mb-56 bg-transparent p-4 pt-0">
        <h2 className="text-l font-bold text-grey">{headerText}</h2>

        <div className="space-y-4 py-4">
          {[...Array(limit).keys()].map((index) => (
            <div key={index} className="cursor-pointer">
              <div className="flex cursor-pointer items-center justify-between space-x-4 text-left">
                <div>
                  <div className="w-[66px] h-[66px] rounded border bg-gray-200 animate-pulse" />
                </div>
                <div className="z-100000 w-full text-left">
                  <h2
                    className="text-l truncate font-bold"
                    style={{ maxWidth: "200px" }}
                  >
                    <div className="h-4 bg-gray-200 animate-pulse" />
                  </h2>
                  <div
                    className="truncate text-xs text-grey mt-2"
                    style={{ maxWidth: "150px" }}
                  >
                    <div className="h-4 bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <button className="bg-red text-2xl text-grey focus:text-black active:text-black">
                  <IoMdAdd />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-56 bg-transparent p-4 pt-0">
      <h2 className="text-l font-bold text-grey">{headerText}</h2>

      <div className="space-y-4 py-4">
        {data.slice(0, limit).map((song, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setSong(song)}
          >
            <div className="flex cursor-pointer items-center justify-between space-x-4 text-left">
              {showImage && (
                <div>
                  <Image
                    className="rounded w-[100px] border"
                    width={200}
                    height={200}
                    src={song.images[1]?.url || "/placeholder.jpg"} // Fallback if image is missing
                    alt={`${song.name} - Album Cover`}
                    priority={true}
                  />
                </div>
              )}
              <div className="z-100000 w-full text-left">
                <h2
                  className="text-l truncate font-bold"
                  style={{ maxWidth: "200px" }}
                >
                  {song.name}
                </h2>
                <p
                  className="truncate text-xs text-grey"
                  style={{ maxWidth: "150px" }}
                >
                  {song.artists
                    ? song.artists.map((artist: any) => artist.name).join(", ")
                    : "MYXIC"}{" "}
                  - {song.album}
                </p>
              </div>
              <button
                className="bg-red text-2xl text-grey focus:text-black active:text-black"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the parent onClick from firing
                  addToQueue(song);
                }}
              >
                <IoMdAdd />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongsList;
