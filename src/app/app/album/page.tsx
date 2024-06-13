"use client";
import { useEffect, useState, Suspense } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useMusic } from "@/app/app/context";
import { getAlbumSongs } from "@/server/utils";
import SongList from "@/components/app/songList";
import Image from "next/image";
import { IoMdAdd } from "react-icons/io";

const AlbumSongsWrapper = () => {
  return (
    <Suspense fallback={<SkeletonAlbumSongsWrapper />}>
      <AlbumSongs />
    </Suspense>
  );
};

const AlbumSongs = () => {
  const searchParams = useSearchParams();
  const albumId = searchParams.get("a");

  const { musicData, setQueue, setCurrentIndex, addToQueue } = useMusic();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);

  const handleBackButton = () => {
    window.history.back();
  };

  useEffect(() => {
    if (musicData && musicData.albums) {
      const fetchedAlbum = musicData.albums.find(
        (album) => album.id === albumId
      );
      setAlbum(fetchedAlbum);
    }
  }, [musicData, albumId]);

  useEffect(() => {
    if (albumId) {
      const fetchSongs = async () => {
        const songs = await getAlbumSongs(albumId);
        setSongs(songs);
      };
      fetchSongs();
    }
  }, [albumId]);

  if (!album) {
    return (
      <div className="mb-56 w-full bg-white">
        <div className="absolute left-0 top-0 flex w-full items-center p-2">
          <button
            className="pb-2 pr-4 pt-4 text-3xl"
            onClick={() => handleBackButton()}
          >
            <IoChevronBackOutline />
          </button>
        </div>

        <div>
          <div className="px-18 bg-white p-16 pb-4 pt-4">
            <div
              className="h-full w-full bg-gray-200 animate-pulse rounded-md"
              style={{ height: 262, width: 262 }}
            />
          </div>
          <div className="px-4 flex justify-center">
            <h2 className="w-1/2 pl-4 text-center bg-gray-200 animate-pulse rounded text-xl h-[28px] font-bold uppercase text-black text-grey"></h2>
          </div>
        </div>

        <div className="mb-56 bg-transparent p-4 pt-0">
          <div className="space-y-4 py-4">
            {[...Array(10).keys()].map((index) => (
              <div key={index} className="cursor-pointer">
                <div className="flex cursor-pointer items-center justify-between space-x-4 text-left">
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
                  <button className="bg-red text-2xl text-gray-200 focus:text-black active:text-black">
                    <IoMdAdd />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSetQueue = (newQueue: any) => {
    setQueue([newQueue]);
    setCurrentIndex(0);
  };

  return (
    <div className="mb-56 w-full bg-white">
      <div className="absolute left-0 top-0 flex w-full items-center p-2">
        <button
          className="pb-2 pr-4 pt-4 text-3xl"
          onClick={() => handleBackButton()}
        >
          <IoChevronBackOutline />
        </button>
      </div>

      <div>
        <div className="px-18 bg-white p-16 pb-4 pt-4">
          <Image
            className="h-full  w-full rounded-xl  border object-cover "
            width={400}
            height={400}
            src={album.images[0].url}
            alt={`${album.name} - Album Cover`}
            priority={true}
          />
        </div>
        <h2 className="w-full px-4 text-center text-xl  font-bold uppercase text-black text-grey">
          {album.name}
        </h2>
      </div>

      <SongList
        data={songs.data}
        setSong={handleSetQueue}
        addToQueue={addToQueue}
        limit={10}
        randomize={false}
        headerText=""
        showImage={false}
      />
    </div>
  );
};

export default AlbumSongsWrapper;

const SkeletonAlbumSongsWrapper = () => {
  return (
    <div className="mb-56 w-full bg-white">
      <div className="absolute left-0 top-0 flex w-full items-center p-2">
        <button className="pb-2 pr-4 pt-4 text-3xl">
          <IoChevronBackOutline />
        </button>
      </div>

      <div>
        <div className="px-18 bg-white p-16 pb-4 pt-4">
          <div
            className="h-full w-full bg-gray-200 animate-pulse rounded-md"
            style={{ height: 262, width: 262 }}
          />
        </div>
        <div className="px-4 flex justify-center">
          <h2 className="w-1/2 pl-4 text-center bg-gray-200 animate-pulse rounded text-xl h-[28px] font-bold uppercase text-black text-grey"></h2>
        </div>
      </div>

      <div className="mb-56 bg-transparent p-4 pt-0">
        <div className="space-y-4 py-4">
          {[...Array(10).keys()].map((index) => (
            <div key={index} className="cursor-pointer">
              <div className="flex cursor-pointer items-center justify-between space-x-4 text-left">
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
                <button className="bg-red text-2xl text-gray-200 focus:text-black active:text-black">
                  <IoMdAdd />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
