"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";

const FooterNav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex w-full items-center justify-between bg-white  px-12 pb-8 pt-4">
      <Link href="/app/">
        <div
          className={`text-gray flex cursor-pointer flex-col items-center text-xs ${
            pathname === "/" ? "text-black" : "text-grey"
          }`}
        >
          <GoHomeFill className="mb-1 text-3xl" />
          <span className="mt-1">Home</span>
        </div>
      </Link>
      <Link href="/app/search">
        <div
          className={`text-gray flex cursor-pointer flex-col items-center text-xs ${
            pathname === "/search" ? "text-black" : "text-grey"
          }`}
        >
          <FiSearch className="mb-1 text-3xl" />
          <span className="mt-1">Search</span>
        </div>
      </Link>
      <Link href="/app/account">
        <div
          className={`text-gray flex cursor-pointer flex-col items-center text-xs ${
            pathname === "/account" ? "text-black" : "text-grey"
          }`}
        >
          <MdAccountCircle className="mb-1 text-3xl" />
          <span>Account</span>
        </div>
      </Link>
    </nav>
  );
};

export default FooterNav;
