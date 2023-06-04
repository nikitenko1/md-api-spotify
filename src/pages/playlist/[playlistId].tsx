import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { usePlaylistModal } from "../../lib/zustand";
import useHandlePlay from "../../hooks/useHandlePlay";
import spotifyApi from "../../lib/spotifyApi";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Container from "../../components/Container";
import Head from "next/head";
import Image from "next/legacy/image";
import NoImage from "../../../public/no-image.jpg";
import timeConversion from "../../helpers/timeConversion";
import PlayButton from "../../components/PlayButton";
import { FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { BsClock } from "react-icons/bs";
import { v4 } from "uuid";
import TrackAlbum from "../../components/TrackAlbum";

const PlaylistPage = () => {
  const router: any = useRouter();
  const { data: session } = useSession();
  const { accessToken }: any = session;

  const [myData, setMyData] = useState<SpotifyApi.CurrentUsersProfileResponse | any>(null);

  const setOpenModal = usePlaylistModal((state) => state.setOpen);
  const setIsEditing = usePlaylistModal((state) => state.setIsEditing);
  const setEdit = usePlaylistModal((state) => state.setEditTrack);
  const handlePlay = useHandlePlay();

  useEffect(() => {
    if (!accessToken) return;
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();

    const fetchMe = async () => {
      try {
        const res = await spotifyApi.getMe();
        setMyData(res.body);
      } catch (err) {
        toast.error(`Oops something went wrong - ${err}`);
      }
    };
    fetchMe();
    return () => controller.abort();
  }, []);

  const fetchPlaylist = async () => {
    // Get a playlist owned by a Spotify user.
    // http GET /playlists/{playlist_id}
    const res = await spotifyApi.getPlaylist(router.query.playlistId);
    return await res.body;
  };

  const { data: playlist, refetch } = useQuery(["fetchPlaylist"], fetchPlaylist);

  useEffect(() => {
    refetch();
  }, [router]);

  let durations: any = playlist?.tracks.items.reduce(
    (acc: any, cur: any) => cur?.track?.duration_ms + acc,
    0
  );
  let isOwner = playlist?.owner.id === myData?.id;

  const openEditModal = () => {
    setOpenModal(true);
    setIsEditing(true);
    setEdit(playlist);
  };

  return (
    <Container>
      <Head>
        <title>Playlist | {playlist?.name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="flex space-y-4 items-center flex-col md:flex-row justify-center text-center 
      gap-x-8 text-white lg:ml-8"
      >
        {playlist?.images.length !== 0 ? (
          <div className="relative h-44 w-full sm:w-1/2 md:w-1/3">
            <Image
              src={playlist?.images[0].url ?? NoImage}
              layout="fill"
              objectFit="cover"
              alt=""
            />
          </div>
        ) : (
          <div className="relative w-44 h-44">
            <Image src={NoImage} layout="fill" objectFit="cover" alt="" />
          </div>
        )}

        <div className="space-y-4 md:space-y-8">
          <p className="uppercase font-semibold text-sm md:text-base tracking-tighter">
            {playlist?.type}
          </p>
          <h1
            className={`${
              isOwner ? "cursor-pointer" : null
            } font-black md:text-5xl lg:text-6xl  text-3xl`}
            onClick={() => {
              isOwner ? openEditModal() : null;
            }}
          >
            {playlist?.name}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base">{playlist?.description}</p>
          <div className="flex items-center gap-x-2 font-semibold text-sm">
            <p>{playlist?.owner.display_name}, </p>
            <p>{playlist?.followers.total} likes,</p>
            <p>{playlist?.tracks.items.length} tracks,</p>
            <p>{timeConversion(durations)}</p>
          </div>
        </div>
      </div>
      <div className="ml-20">
        <div className="p-4 flex items-center gap-x-6">
          <PlayButton large={true} handlePlay={() => handlePlay(playlist)} item={playlist} />
          <FiHeart className="text-4xl text-gray-400 " />
          <FiMoreHorizontal className="text-4xl text-gray-400" />
        </div>
        <div className="flex flex-col gap-y-4 mt-4">
          <div className="md:flex items-center gap-x-4 hidden px-4 py-2 text-gray-400">
            <p>#</p>
            <p className="flex-[0.5]">TITLE</p>
            <p className="flex-[0.5]">ALBUM</p>
            <BsClock />
          </div>
          {playlist?.tracks.items.map((playlist: SpotifyApi.PlaylistTrackObject, i) => (
            <TrackAlbum key={v4()} track={playlist?.track} index={i + 1} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default PlaylistPage;