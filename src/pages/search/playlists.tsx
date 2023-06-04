import React, { useEffect } from "react";
import Body from "../../components/Body";
import ArtistSearchItem from "../../components/ArtistSearchItem";
import { v4 } from "uuid";
import PlaylistSearchItem from "../../components/PlaylistSearchItem";
import Search from "../../components/Search";
import { useSearch } from "../../lib/zustand";
import useDebounce from "../../hooks/useDebounce";
import { useSession } from "next-auth/react";
import spotifyApi from "../../lib/spotifyApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";

const PlaylistsPage = () => {
  const search = useSearch((state) => state.search);
  const debouncedSearch = useDebounce(search, 500);

  const { data: session } = useSession();
  const { accessToken }: any = session;

  useEffect(() => {
    if (!accessToken) return;
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const fetchPlaylistsSearch = async () => {
    // Get Spotify catalog information about albums, artists, playlists, tracks, shows,
    // episodes or audiobooks that match a keyword string.
    const res = await spotifyApi.searchPlaylists(debouncedSearch, {
      limit: 40,
    });
    return res.body;
  };

  const {
    data: playlistsSearch,
    isLoading,
    refetch,
  } = useQuery(["fetchPlaylistsSearch"], fetchPlaylistsSearch);

  useEffect(() => {
    refetch();
  }, [debouncedSearch]);
  if (isLoading) return <Loader />;

  return (
    <>
      <Search />
      <Body>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
          {playlistsSearch?.playlists?.items.map((playlist) => (
            <PlaylistSearchItem key={v4()} playlist={playlist} />
          ))}
        </div>
      </Body>
    </>
  );
};

export default PlaylistsPage;
