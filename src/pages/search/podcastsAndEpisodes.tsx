import React, { useEffect } from "react";
import { useSearch } from "../../lib/zustand";
import { useSession } from "next-auth/react";
import useDebounce from "../../hooks/useDebounce";
import spotifyApi from "../../lib/spotifyApi";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import Search from "../../components/Search";
import Body from "../../components/Body";
import { v4 } from "uuid";
import EpisodeSearchItem from "../../components/EpisodeSearchItem";

const PodcastsPage = () => {
  const search = useSearch((state) => state.search);
  const debouncedSearch = useDebounce(search, 500);

  const { data: session } = useSession();
  const { accessToken }: any = session;

  useEffect(() => {
    if (!accessToken) return;
    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  const fetchPodcastsSearch = async () => {
    // Get Spotify catalog information about albums, artists, playlists, tracks, shows,
    // episodes or audiobooks that match a keyword string.
    const res = await spotifyApi.searchEpisodes(debouncedSearch, {
      limit: 40,
    });
    return res.body;
  };

  const {
    data: searchPodcasts,
    isLoading,
    refetch,
  } = useQuery(["fetchPodcastSearch"], fetchPodcastsSearch);
  useEffect(() => {
    refetch();
  }, [debouncedSearch]);
  if (isLoading) return <Loader />;

  return (
    <>
      <Search />
      <Body>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
          {searchPodcasts?.episodes?.items.map((episode) => (
            <EpisodeSearchItem key={v4()} episode={episode} />
          ))}
        </div>
      </Body>
    </>
  );
};

export default PodcastsPage;
