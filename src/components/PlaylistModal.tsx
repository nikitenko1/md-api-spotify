import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import { usePlaylistModal } from "../lib/zustand";
import { useOnClickOutside } from "usehooks-ts";
import spotifyApi from "../lib/spotifyApi";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import Image from "next/legacy/image";
import NoImage from "../../public/no-image.jpg";

interface IProps {
  isEditing: boolean;
}

const PlaylistModal = ({ isEditing }: IProps) => {
  const [name, setName] = useState<string>("");
  const router: any = useRouter();
  const [description, setDescription] = useState<string>("");
  const { data: session } = useSession();
  const { accessToken }: any = session;

  useEffect(() => {
    if (!accessToken) return;
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const setOpen = usePlaylistModal((state) => state.setOpen);
  const editValue = usePlaylistModal((state) => state.editTrack);

  const modal = useRef<HTMLDivElement>(null);

  const clickOutsidehandler = () => {
    setOpen(false);
  };
  useOnClickOutside(modal, clickOutsidehandler);

  const editPlaylist = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // Change a playlist's name and public/private state. (The user must, of course, own the playlist.)
    // PUT /playlists/{playlist_id}
    const res = await spotifyApi.changePlaylistDetails(router.query.playlistId, {
      name: name || editValue.name,
      description: description || editValue.description,
    });

    toast.success("Playlist changed to " + name);
    return res;
  };

  const createPlaylist = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.)
    // POST /users/{user_id}/playlists
    const res = await spotifyApi.createPlaylist(name, {
      description,
      public: true,
    });

    setName("");
    setDescription("");
    setOpen(false);
    router.push(`/playlist/${res.body.id}`);

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } py-2 text-center bg-blue-500 rounded-lg w-40`}
      >
        <p className="text-white">Playlist created</p>
      </div>
    ));

    return res;
  };

  return (
    <div className="p-4 bg-zinc-800 rounded-xl text-white space-y-3 min-w-[50%]" ref={modal}>
      <header className="flex justify-between items-center ">
        <p className="font-bold text-xl">{isEditing ? "Edit details" : "Create playlist"}</p>
        <IoMdClose
          className="text-gray-400 cursor-pointer hover:text-gray-100"
          onClick={() => setOpen(false)}
        />
      </header>
      <form
        className="flex flex-col space-y-4"
        onSubmit={isEditing ? editPlaylist : createPlaylist}
      >
        <div className="flex gap-4 flex-col md:flex-row">
          <Image src={NoImage} height={200} width={200} alt="" />
          <div className="space-y-2 flex flex-col">
            <input
              onChange={(e) => setName(e.target.value)}
              defaultValue={isEditing ? editValue.name : ""}
              placeholder="Enter playlist's name"
              className="bg-zinc-700 text-sm md:text-base px-2 py-1 md:px-4 md:py-2 rounded-lg outline-none"
            />
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={isEditing ? editValue.description : ""}
              placeholder="Add an optional description "
              className="px-2 py-1 text-sm md:text-base md:px-4 md:py-2 bg-zinc-700 rounded-lg outline-none"
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="font-bold text-sm md:text-base text-black bg-white px-4 py-1 md:px-6 md:py-2 
          rounded-full self-end"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default PlaylistModal;
