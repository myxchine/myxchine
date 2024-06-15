"use client";

import { useState } from "react";

import { createPlaylist } from "@/server/utils";
import { IoMdAdd } from "react-icons/io";
import { useAuth } from "@/app/context";

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  url: string;
}

interface Props {
  data: Playlist[];
}
const Home: React.FC<Props> = ({ data }) => {
  const handleCreatePlaylist = async (name: string) => {
    try {
      if (user) {
        const newPlaylist = await createPlaylist({
          name: name,
          userId: user.id,
        });
        console.log("New playlist created:", newPlaylist);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    } finally {
      setAdding(false);
    }
  };

  const [adding, setAdding] = useState<boolean>(false);
  const [name, setName] = useState("");
  const { user } = useAuth();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleCreatePlaylist(name);
    console.log("Submitted name:", name);
  };


  if (!data) {
    return (
      <div className="mb-56 space-y-4 p-4 pt-0">
        <h2 className="text-l font-bold text-grey">Your Playlists</h2>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(5).keys()].map((index) => (
            <div key={index} className="col-2">
              <div className="w-full cursor-pointer items-center text-left">
                <div
                  className="w-full rounded-xl bg-gray-200 animate-pulse"
                  style={{ height: 200 }}
                />
                <h2
                  className="mt-2 w-full truncate text-xl font-bold"
                  style={{ maxWidth: "100px" }}
                >
                  <div className="h-4 bg-gray-200 animate-pulse" />
                </h2>
              </div>
            </div>
          ))}
          <div className="col-2 h-full pb-9">
            <div
              className="flex aspect-square h-full w-full cursor-pointer items-center justify-center rounded-xl border text-center align-middle text-5xl"
              onClick={() => setAdding(true)}
            >
              <IoMdAdd />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-56 space-y-4 p-4 pt-0">
      {!adding && (
        <h2 className="text-l  font-bold text-grey">Your Playlists</h2>
      )}

      {adding && (
        <form
          onSubmit={handleSubmit}
          className="rounded bg-white p-6 shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              NAME OF PLAYLIST
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="focus:shadow-outline hover:bg-black-700 rounded bg-black px-4 py-2 font-bold text-white focus:outline-none"
          >
            CREATE
          </button>
        </form>
      )}
      {!adding && (
        <div className="grid grid-cols-2 gap-4">
          {data &&
            data.data.map((playlist, index) => (
              <div key={index} className="col-2">
                <div className="w-full cursor-pointer items-center text-left">
                  <img
                    className="w-full rounded-xl"
                    width={500}
                    src="/images/default.png"
                    alt={`${playlist.name} - Album Cover`}
                  />
                  <h2
                    className="mt-2 w-full truncate text-xl font-bold"
                    style={{ maxWidth: "100px" }}
                  >
                    {playlist.name}
                  </h2>
                </div>
              </div>
            ))}
          <div className="col-2 h-full pb-9">
            <div
              className="flex aspect-square h-full w-full cursor-pointer items-center justify-center rounded-xl border text-center align-middle text-5xl"
              onClick={() => setAdding(true)}
            >
              <IoMdAdd />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
