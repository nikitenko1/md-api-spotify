import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { usePlaylistModal } from "../lib/zustand";
import Image from "next/legacy/image";
import Link from "next/link";
import {
  IoMdHome,
  IoMdCompass,
  IoMdMicrophone,
  IoMdClock,
  IoMdLogOut,
  IoMdSearch,
} from "react-icons/io";
import { HiChartBar, HiDotsHorizontal } from "react-icons/hi";
import { BsPlusSquare } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const setOpen = usePlaylistModal((state) => state.setOpen);
  const setIsEditing = usePlaylistModal((state) => state.setIsEditing);

  return (
    <section
      className="fixed min-h-full top-0 z-40 flex flex-col p-2 md:p-4 items-center bg-[#1A161F]
     w-[60px] lg:w-[80px] space-y-8 h-screen"
    >
      {session ? (
        <>
          <Image src="/logo.png" width={60} height={60} alt="logo" objectFit="contain" />
          <div className="space-y-6 flex flex-col">
            <Link href="/">
              <Tooltip placement="rightStart" content={"Home"}>
                <IoMdHome
                  data-tip="Home"
                  className={`icon ${router.pathname === "/" ? "text-white" : ""}`}
                />
              </Tooltip>
            </Link>
            <div onClick={() => router.push("/search", undefined, { shallow: true })}>
              <Tooltip placement="rightStart" content={"Search"}>
                <IoMdSearch
                  className={`icon ${router.pathname === "/search" ? "text-white" : ""}`}
                />
              </Tooltip>
            </div>
            <div
              onClick={() => {
                setOpen(true);
                setIsEditing(false);
                window.scrollTo(0, 0);
              }}
            >
              <Tooltip placement="rightStart" content={"Create playlist"}>
                <BsPlusSquare className="icon" />
              </Tooltip>
            </div>
            <Link href="/profile">
              <div data-tip="Profile">
                <Tooltip placement="rightStart" content={"Profile"}>
                  <FaUser className="icon" />
                </Tooltip>
              </div>
            </Link>
            <IoMdCompass className="icon" />

            <IoMdMicrophone className="icon" />
            <HiChartBar className="icon" />
            <IoMdClock className="icon" />
            <HiDotsHorizontal className="icon" />
          </div>
          <IoMdLogOut
            className="text-2xl cursor-pointer text-white block md:hidden"
            onClick={() => signOut({ redirect: false })}
          />
        </>
      ) : null}
    </section>
  );
};

export default Sidebar;
