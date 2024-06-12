"use client";
import { useMusic } from "../../context";
import Playlists from "@/components/app/playlistList";

const Home = () => {
  const { musicData } = useMusic();

  return (
    <main>
      <Playlists data={musicData.playlists} />
    </main>
  );
};

export default Home;
