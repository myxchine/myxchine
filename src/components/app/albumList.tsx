"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { id: string; name: string }[];
}

interface Props {
  data: Album[];
  limit: number;
  headerText: string;
  randomize: boolean; // Add new prop for randomizing
}

const shuffleArray = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const Home: React.FC<Props> = ({
  data,
  limit,
  headerText,
  randomize, // Destructure the new prop
}) => {
  const [shuffledData, setShuffledData] = useState<Album[]>([]);

  useEffect(() => {
    if (data) {
      if (randomize) {
        setShuffledData(shuffleArray(data.data));
      } else {
        setShuffledData(data.data);
      }
    }
  }, [data, randomize]);

  if (!data) {
    return (
      <div className="mb-0">
        <h2 className="text-l pl-4 font-bold text-grey">{headerText}</h2>
        <div className="grid grid-cols-2 gap-4 p-4">
          {[...Array(limit).keys()].map((index) => (
            <div key={index} className="col-2">
              <div className="w-full cursor-pointer items-center text-left">
                <div
                  className="w-full rounded-xl border bg-gray-200 animate-pulse"
                  style={{ height: 171, width: 171 }}
                />
                <h2
                  className="mt-2 w-full truncate text-xl font-bold"
                  style={{ maxWidth: "100px" }}
                >
                  <div className="h-4 bg-gray-200 animate-pulse" />
                </h2>
                <h2
                  className="text-s mt-2 w-1/2 truncate text-grey"
                  style={{ maxWidth: "100px" }}
                >
                  <div className="h-4 bg-gray-200 animate-pulse" />
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-0">
      <h2 className="text-l pl-4 font-bold text-grey">Recently Added</h2>
      <div className="grid grid-cols-2 gap-4 p-4">
        {shuffledData.slice(0, limit).map((album: Album, index: number) => (
          <div key={index} className="col-2 ">
            <Link href={`/app/album?a=${album.id}`}>
              <div className=" w-full cursor-pointer items-center text-left">
                <Image
                  className="w-full rounded-xl border"
                  width={200}
                  height={200}
                  src={album.images[0].url}
                  alt={`${album.name} - Album Cover`}
                  priority={true}
                />
                <h2
                  className="mt-2 w-full truncate text-xl font-bold"
                  style={{ maxWidth: "100px" }}
                >
                  {album.name}
                </h2>
                <h2
                  className="text-s  truncate text-grey"
                  style={{ maxWidth: "100px" }}
                >
                  {album.artists.map((artist: any) => artist.name).join(", ")}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
