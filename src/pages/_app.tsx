import "../styles/globals.css";
import { AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePlaylistModal } from "../lib/zustand";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import AuthWrapper from "../components/AuthWrapper";
import Layout from "../components/Layout";
import { Session } from "next-auth";
import Backdrop from "../components/Backdrop";
import PlaylistModal from "../components/PlaylistModal";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const isOpen = usePlaylistModal((state) => state.isOpen);
  const isEditing = usePlaylistModal((state) => state.isEditing);

  const router = useRouter();
  const variants = {
    hidden: { opacity: 0, x: 1000 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 1000 },
  };

  const queryClient = new QueryClient();

  return (
    <SessionProvider session={session}>
      <AuthWrapper>
        <QueryClientProvider client={queryClient}>
          <Toaster />

          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          <Layout>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                transition={{
                  type: "spring",
                }}
                key={router.route}
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
              >
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </Layout>
          {isOpen && (
            <Backdrop>
              <PlaylistModal isEditing={isEditing} />
            </Backdrop>
          )}
        </QueryClientProvider>
      </AuthWrapper>
    </SessionProvider>
  );
};

export default MyApp;
