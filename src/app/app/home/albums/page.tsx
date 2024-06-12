"use client";
import { useMusic } from "../../context";
import AlbumList from "@/components/app/albumList";

const Home = () => {
  const { musicData } = useMusic();

  return (
    <main>
      <AlbumList
        data={musicData.albums}
        limit={6}
        headerText="Recently Added"
        randomize={false}
      />
    </main>
  );
};

export default Home;
