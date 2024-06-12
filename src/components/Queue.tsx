import Image from "next/image";

const SongsComponent: React.FC<Props> = ({ songs }) => {
  const handleClick = (song: Song) => {
    console.log("Clicked", song);
  };

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-l text-white">Queue</h2>
      {songs.map((song, index) => (
        <div key={index} className=" pb-2">
          <div
            className="flex cursor-pointer items-center space-x-4 text-left"
            onClick={() => handleClick(song)}
          >
            <div>
              <Image
                className="rounded w-[70px]"
                width={200}
                height={200}
                src={song.images[0].url}
                alt={`${song.name} - Album Cover`}
              />
            </div>
            <div>
              <h2
                className="text truncate text-white"
                style={{
                  maxWidth: "250px",
                }}
              >
                {song.name}
              </h2>
              <p
                className="truncate text-xs text-white text-opacity-50"
                style={{
                  maxWidth: "200px",
                }}
              >
                {song.artists.map((artist) => artist.name).join(", ")} -{" "}
                {song.albumName}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongsComponent;
