import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import spotifyApi from "../lib/spotifyApi";
import { toast } from "react-hot-toast";
import { AiOutlineCaretRight } from "react-icons/ai";
import { useHover } from "usehooks-ts";
import PlaylistMenuList from "./PlaylistMenuList";
import { useOnClickOutside } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";

interface IProps {
  clickOutside: () => void;
}

const PlaylistMenu = ({ clickOutside }: IProps) => {
  const [myData, setMyData] = useState<SpotifyApi.CurrentUsersProfileResponse | any>(null);
  const menu = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { accessToken }: any = session;

  useEffect(() => {
    if (!accessToken) return;
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    // if (!accessToken) return;
    const controller = new AbortController();

    const fetchMe = async () => {
      try {
        // Get detailed profile information about the current user (including the current user's username).
        // http GET /me
        const res = await spotifyApi.getMe();
        setMyData(res.body);
      } catch (err) {
        toast.error(`Oops something went wrong - ${err}`);
      }
    };
    fetchMe();
    return () => controller.abort();
  }, []);

  const fetchMyPlaylists = async () => {
    // Get a list of the playlists owned or followed by a Spotify user.
    // http GET /users/{user_id}/playlists
    const res = await spotifyApi.getUserPlaylists(myData?.id);
    return res.body;
  };

  const { data: myPlaylists } = useQuery(["fetchMyPlaylists"], fetchMyPlaylists);

  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  useOnClickOutside(menu, clickOutside);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={menu}
      className="bg-neutral-900 p-1 absolute top-full rounded-sm right-0 w-44 text-white"
    >
      <ul>
        <div className="p-2 hover:bg-neutral-700 ">
          <div className="relative  flex items-center rounded-sm justify-between" ref={hoverRef}>
            <li>Add to playlist</li>
            <AiOutlineCaretRight />
            {isHover && <PlaylistMenuList myPlaylists={myPlaylists?.items} />}
          </div>
        </div>
      </ul>
    </div>
  );
};

export default PlaylistMenu;
