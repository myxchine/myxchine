"use client";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import spotifyApi from "@/utils/songSearch";
import searchFile from "@/utils/searchFile";
import downloadFile from "@/utils/cloud";
import { checkSongExists, createNewSong, createNewAlbum } from "@/server/utils";
import Image from "next/image";
import { useMusic } from "@/app/app/context";

const SongSuggest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingStatus, setDownloadingStatus] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const { getClientAlbums } = useMusic();

  const handleSongSelect = async (song: any) => {
    console.log(song);

    const userConfirmed = confirm(
      `The song "${song.name}" is not live yet. Do you want to deploy it?`
    );
    if (userConfirmed) {
      setIsDownloading(true);
      setDownloadingStatus("Locating song...");
      try {
        const file = await searchFile(
          `${song.name}  full official version, ${song.album.artists
            .map((artist: any) => artist.name)
            .join(", ")} `
        );

        const id: string = file.items[0].id.videoId;

        console.log(id);

        setDownloadingStatus("Downloading audio...");

        const url = await downloadFile(id, song.id);

        console.log(url);

        setDownloadingStatus("Deploying song...");

        console.log;

        const newAlbum = await createNewAlbum(song.album);

        console.log(newAlbum);

        const newSong = await createNewSong(song, url);

        console.log(newSong);

        const fetchNew = getClientAlbums(10);

        router.push(`/app/album?a=${song.album.id}`);
      } catch (error) {
        console.error(error);
        setIsDownloading(false);
      }
    }
  };

  const handleSearch = async () => {
    setSuggestions([]);
    setIsLoading(true);
    setError(null);
    try {
      // Fetch track suggestions from Spotify based on the search term
      const response = await spotifyApi(searchTerm);
      if (!response) {
        throw new Error("Failed to fetch track suggestions.");
      }
      setSuggestions(response);

      setIsLoading(false);
      console.log(response);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mb-48 mt-20">
      <div className="fixed top-0 w-full p-4">
        <div className="relative">
          <input
            type="text"
            className="focus:border-red w-full rounded-xl border p-4 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter song name..."
          />
          <button
            className="absolute right-4 h-full items-center"
            onClick={handleSearch}
            disabled={!searchTerm || isLoading}
          >
            <FiSearch className="mb-1 text-3xl" />
          </button>
        </div>
      </div>

      {isLoading && (
        <h2 className="w-full p-4 pb-2 text-center text-xl font-bold">
          LOADING...
        </h2>
      )}

      {isDownloading && (
        <h2 className="w-full p-4 pb-2 text-center text-xl font-bold">
          {downloadingStatus}
        </h2>
      )}

      {error && (
        <h2 className="w-full p-4 pb-2 text-center font-bold text-red-500">
          Error: {error}
        </h2>
      )}

      {suggestions.length > 0 && !isLoading && !isDownloading && (
        <ul>
          <h2 className="p-4 pb-2 text-xl font-bold">RESULTS</h2>
          {suggestions.map((suggestion, index) => (
            <li key={index}>
              <div
                onClick={() => handleSongSelect(suggestion)}
                className={`cursor-pointer p-4 pb-2 ${
                  suggestion.url ? "text-black" : "text-black opacity-50"
                }`}
              >
                <div className="borderl flex items-center space-x-4 text-left">
                  <div>
                    <Image
                      className="rounded w-[70px]"
                      width={80}
                      height={80}
                      src={suggestion.album.images[0].url}
                      alt={`${suggestion.name} - Album Cover`}
                      priority={true}
                    />
                  </div>
                  <div>
                    <h2
                      className="truncate text-xl font-bold"
                      style={{ maxWidth: "250px" }}
                    >
                      {suggestion.name}
                    </h2>
                    <p
                      style={{ maxWidth: "150px" }}
                      className="truncate text-grey"
                    >
                      {suggestion.album.artists
                        .map((artist: any) => artist.name)
                        .join(", ")}
                      - {suggestion.album.name}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongSuggest;
