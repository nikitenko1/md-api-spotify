import React, { useEffect, useState } from "react";
import PlaylistsSearch from "./PlaylistsSearch";
import { usePlayTrack } from "../lib/zustand";
import { shallow } from "zustand/shallow";
import { useSession } from "next-auth/react";
import spotifyApi from "../lib/spotifyApi";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "./Sidebar";
import Body from "./Body";
import Container from "./Container";

interface IProps {
  myPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined;
}

const HomeComponent = ({ myPlaylists }: IProps) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [playingTrack, setPlayingTrack] = usePlayTrack(
    // Array pick, re-renders the component when either state.playingTrack or state.setPlayingTrack change
    (state: any) => [state.playingTrack, state.setPlayingTrack],
    shallow
  );

  const [isPlaying, setIsPlaying] = usePlayTrack(
    // Array pick, re-renders the component when either state.isPlaying or state.setIsPlaying change
    (state: any) => [state.isPlaying, state.setIsPlaying],
    shallow
  );

  const handlePlay = (items: SpotifyApi.AlbumObjectFull) => {
    setPlayingTrack(items);

    if (items.uri === playingTrack?.uri) {
      setIsPlaying(!isPlaying);
    }
  };

  const { data: session } = useSession();
  const { accessToken }: any = session;
  const [newReleases, setNewReleases] = useState<any>(null);

  const fetchFeaturedPlaylists = async () => {
    const res = await spotifyApi.getFeaturedPlaylists();
    return await res.body;
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    const fetchNewReleases = async () => {
      try {
        // Get a list of new album releases featured in Spotify
        // (shown, for example, on a Spotify player’s “Browse” tab)
        // http GET https://api.spotify.com/v1/browse/new-releases
        const res = await spotifyApi.getNewReleases({ limit: 10 });
        setNewReleases(res.body.albums.items);
      } catch (err) {
        toast.error(`Oops something went wrong - ${err}`);
      }
    };

    fetchNewReleases();
  }, [accessToken]);

  useEffect(() => {
    setShowPlayer(true);
  }, []);

  const featuredPlaylists = useQuery(["fetchFeaturedPlaylists"], fetchFeaturedPlaylists);

  return (
    <Body>
      <Container>
        <main className="space-y-4">
          <h1 className="text-white text-2xl font-bold mb-2">New Releases</h1>
          <div className="space-y-4">
            <PlaylistsSearch
              playlists={featuredPlaylists?.data?.playlists.items}
              title={featuredPlaylists?.data?.message}
            />
            <PlaylistsSearch playlists={myPlaylists} title="Your playlists" />
          </div>
        </main>
      </Container>
    </Body>
  );
};

export default HomeComponent;
