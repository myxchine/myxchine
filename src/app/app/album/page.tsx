"use client";
import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useMusic } from "@/app/app/context";
import { getAlbumSongs } from "@/server/utils";
import SongList from "@/components/app/songList";

import Image from "next/image";

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
      const fetchedAlbum = musicData.albums.data.find(
        (album) => album.id === albumId
      );
      setAlbum(fetchedAlbum);
    }
  }, [musicData, albumId]);

  useEffect(() => {
    if (albumId) {
      const fetchSongs = async () => {
        const songs = await getAlbumSongs(albumId);

        console.log(songs);
        setSongs(songs);
      };
      fetchSongs();
    }
  }, [albumId]);

  if (!album) {
    return <div>Loading...</div>;
  }

  const handleSetQueue = (newQueue) => {
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
        <h2 className="w-full pl-4 text-center text-xl  font-bold uppercase text-black text-grey">
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

export default AlbumSongs;
