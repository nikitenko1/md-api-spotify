import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import spotifyApi from "../lib/spotifyApi";

interface IProps {
  children: React.ReactNode;
}
const Body = ({ children }: IProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const accessToken: any = session?.accessToken;

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  return (
    <section
      className={`bg-black pb-32 lg:max-w-full min-h-screen ${
        router.pathname !== "/auth/signin" ? "ml-12" : "ml-0"
      } p-4 space-y-8 flex-grow`}
    >
      {children}
    </section>
  );
};

export default Body;
