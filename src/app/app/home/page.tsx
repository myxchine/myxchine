"use client";
import { useMusic } from "../context";
import SongsList from "@/components/app/songList";
import AlbumList from "@/components/app/albumList";

const Home = () => {
  const {
    musicData,
    setQueue,
    setCurrentIndex,
    addToQueue,
    randomAlbums,
    randomSongs,
  } = useMusic();

  const handleSetQueue = (newQueue) => {
    setQueue([newQueue]);
    setCurrentIndex(0);
  };

  return (
    <main>
      <AlbumList
        data={randomAlbums}
        limit={2}
        headerText="Recently Added"
        randomize={true}
      />

      <SongsList
        data={randomSongs}
        setSong={handleSetQueue}
        addToQueue={addToQueue}
        limit={5}
        headerText="For you"
        showImage={true}
        randomize={true}
      />
    </main>
  );
};

export default Home;
