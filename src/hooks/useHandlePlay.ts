import { shallow } from "zustand/shallow";
import { usePlayTrack } from "../lib/zustand";

export default function useHandlePlay() {
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

  const handlePlay = (items: any) => {
    setPlayingTrack(items);

    if (items.uri === playingTrack?.uri) {
      setIsPlaying(!isPlaying);
    }
  };

  return handlePlay;
}
