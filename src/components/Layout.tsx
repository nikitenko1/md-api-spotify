import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Body from "./Body";
import Right from "./Right";
import Sidebar from "./Sidebar";
import Player from "./Player";
import { shallow } from "zustand/shallow";
import { usePlayTrack } from "../lib/zustand";
import { AnimatePresence, useScroll } from "framer-motion";
import ProgressBar from "./ProgressBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [showPlayer, setShowPlayer] = useState(false);

  const [playingTrack, setPlayingTrack] = usePlayTrack(
    // Array pick, re-renders the component when either state.playingTrack or state.setPlayingTrack change
    (state: any) => [state.playingTrack, state.setPlayingTrack],
    shallow
  );

  useEffect(() => {
    setShowPlayer(true);
  }, [playingTrack]);

  // useScroll is used to create scroll-linked animations, like progress indicators and parallax effects.
  const { scrollYProgress } = useScroll();

  return (
    <main className="scroll-smooth">
      {status === "authenticated" ? <Sidebar /> : null}
      <AnimatePresence
        initial={false}
        // Only render one component at a time.
        // animation before entering component is rendered
        mode="wait"
        // Fires when all exiting nodes have completed animating out
        onExitComplete={() => null}
      >
        <ProgressBar progress={scrollYProgress} />
        <Body>{children}</Body>

        {status === "authenticated" ? (
          <div className="hidden lg:block">
            <Right />
          </div>
        ) : null}
      </AnimatePresence>
      {showPlayer && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Player accessToken={session?.accessToken} trackUri={playingTrack?.uri} />
        </div>
      )}
    </main>
  );
};

export default Layout;
