import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import ProtectedRoute from "./ProtectedRoute";

const authRoutes = [
  "/album/[albumId]",
  "/artist/[artistId]",
  "/genre/[categoryId]",
  "/playlist/[playlistId]",
  "/profile",
  "/search",
  "/search/albums",
  "/search/artists",
  "/search/playlists",
  "/search/podcastsAndEpisodes",
  "/search/tracks",
  "/search/",
  "/show/[showId]",
  "/",
];

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();
  console.log(session);

  if (session.status === "loading") return null;

  return (
    <>
      {authRoutes.includes(router.pathname) ? (
        <ProtectedRoute>{children}</ProtectedRoute>
      ) : (
        children
      )}
    </>
  );
};

export default AuthWrapper;
