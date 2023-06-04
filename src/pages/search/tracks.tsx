import React, { ReactElement, useEffect } from "react";
import { useSearch } from "../../lib/zustand";
import { useSession } from "next-auth/react";
import useDebounce from "../../hooks/useDebounce";
import spotifyApi from "../../lib/spotifyApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import Body from "../../components/Body";
import { BsClock } from "react-icons/bs";
import TrackAlbum from "../../components/TrackAlbum";
import { v4 } from "uuid";
import Search from "../../components/Search";

const TrackPage = () => {
  const search = useSearch((state) => state.search);
  const debouncedSearch = useDebounce(search, 500);

  const { data: session } = useSession();
  const { accessToken }: any = session;

  useEffect(() => {
    if (!accessToken) return;
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const fetchSearchTracks = async () => {
    // Get Spotify catalog information about albums, artists, playlists, tracks, shows,
    // episodes or audiobooks that match a keyword string.
    const res = await spotifyApi.searchTracks(debouncedSearch, {
      limit: 40,
    });
    return await res.body;
  };

  const {
    data: searchTracks,
    isLoading,
    refetch,
  } = useQuery(["fetchSearchTracks"], fetchSearchTracks);

  useEffect(() => {
    refetch();
  }, [debouncedSearch]);

  if (isLoading) return <Loader />;

  return (
    <>
      <Search />
      <Body>
        <header className="sticky hidden bg-black p-4 top-0 md:flex items-center text-gray-400 gap-x-4">
          <p>#</p>
          <p className="flex-[0.5]">TITLE</p>
          <p className="flex-[0.5]">ALBUM</p>
          <BsClock />
        </header>
        {searchTracks?.tracks?.items.map((track, i) => (
          <TrackAlbum track={track} key={v4()} index={i + 1} />
        ))}
      </Body>
    </>
  );
};

export default TrackPage;
