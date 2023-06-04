import React, { useEffect } from "react";
import { useSearch } from "../../lib/zustand";
import useDebounce from "../../hooks/useDebounce";
import { useSession } from "next-auth/react";
import spotifyApi from "../../lib/spotifyApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { v4 } from "uuid";
import ArtistSearchItem from "../../components/ArtistSearchItem";
import Body from "../../components/Body";
import Search from "../../components/Search";

const ArtistsPage = () => {
  const search = useSearch((state) => state.search);
  const debouncedSearch = useDebounce(search, 500);

  const { data: session } = useSession();
  const { accessToken }: any = session;

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);
  const fetchArtistsSearch = async () => {
    // Get Spotify catalog information about albums, artists, playlists, tracks, shows,
    // episodes or audiobooks that match a keyword string.
    const res = await spotifyApi.searchArtists(debouncedSearch, {
      limit: 40,
    });
    return res.body;
  };

  const {
    data: searchArtists,
    isLoading,
    refetch,
  } = useQuery(["fetchArtistsSearch"], fetchArtistsSearch);

  useEffect(() => {
    refetch();
  }, [debouncedSearch]);
  if (isLoading) return <Loader />;

  return (
    <>
      <Search />
      <Body>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
          {searchArtists?.artists?.items.map((artist) => (
            <ArtistSearchItem key={v4()} artist={artist} />
          ))}
        </div>
      </Body>
    </>
  );
};

export default ArtistsPage;
