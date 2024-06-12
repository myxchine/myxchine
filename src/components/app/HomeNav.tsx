"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FooterNav = () => {
  const pathname = usePathname();

  return (
    <nav className="items-center justify-between sticky left-0 top-0 flex w-full space-x-0 bg-white p-4 text-sm">
      <Link href="/app/home/" passHref>
        <div
          className={`text-gray flex w-full cursor-pointer flex-col items-center rounded-md border font-bold ${
            pathname === "/app/home" ? " text-white bg-black " : " text-black"
          }`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-xl p-4 py-2  w-full">
            EXPLORE
          </div>
        </div>
      </Link>
      <Link href="/app/home/albums" passHref>
        <div
          className={`text-gray flex w-full cursor-pointer flex-col items-center rounded-md  border font-bold ${
            pathname === "/app/home/albums"
              ? " text-white bg-black "
              : " text-black"
          }`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-md  p-4 py-2  w-full">
            ALBUMS
          </div>
        </div>
      </Link>

      <Link href="/app/home/playlists" passHref>
        <div
          className={`text-gray flex w-full cursor-pointer flex-col items-center rounded-md border font-bold ${
            pathname === "/app/home/playlists"
              ? " text-white bg-black "
              : " text-black"
          }`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-md p-4 py-2  w-full">
            PLAYLISTS
          </div>
        </div>
      </Link>
    </nav>
  );
};

export default FooterNav;
