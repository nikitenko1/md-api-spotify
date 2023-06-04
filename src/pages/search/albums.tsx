import React, { useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useSearch } from "../../lib/zustand";
import { useSession } from "next-auth/react";
import spotifyApi from "../../lib/spotifyApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { v4 } from "uuid";
import AlbumSearchItem from "../../components/AlbumSearchItem";
import Body from "../../components/Body";

const AlbumsPage = () => {
  const search = useSearch((state) => state.search);
  const debouncedSearch = useDebounce(search, 500);

  const { data: session } = useSession();
  const { accessToken }: any = session;

  useEffect(() => {
    if (!accessToken) return;
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const fetchAlbumsSearch = async () => {
    // Get Spotify catalog information about albums, artists, playlists, tracks, shows,
    // episodes or audiobooks that match a keyword string.
    const res = await spotifyApi.searchAlbums(debouncedSearch, {
      limit: 40,
    });
    return await res.body;
  };

  const {
    data: searchAlbums,
    isLoading,
    refetch,
  } = useQuery(["fetchArtistsSearch"], fetchAlbumsSearch);

  useEffect(() => {
    refetch();
  }, [debouncedSearch]);
  if (isLoading) return <Loader />;

  return (
    <Body>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
        {searchAlbums?.albums?.items.map((album) => (
          <AlbumSearchItem key={v4()} album={album} />
        ))}
      </div>
    </Body>
  );
};

export default AlbumsPage;
