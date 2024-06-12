"use client";
import { useMusic } from "../context";
import SongsList from "@/components/app/songList";
import AlbumList from "@/components/app/albumList";

const Home = () => {
  const { musicData, setQueue, setCurrentIndex, addToQueue } = useMusic();

  const handleSetQueue = (newQueue) => {
    setQueue([newQueue]);
    setCurrentIndex(0);
  };

  return (
    <main>
      <AlbumList
        data={musicData.albums}
        limit={2}
        headerText="Recently Added"
        randomize={true}
      />

      <SongsList
        data={musicData.songs}
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
