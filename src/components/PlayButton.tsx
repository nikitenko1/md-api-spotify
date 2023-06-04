import React from "react";
import { usePlayTrack } from "../lib/zustand";
import { FaPause, FaPlay } from "react-icons/fa";

interface IProps {
  large?: boolean;
  handlePlay: (items: any) => void;
  item: any;
}

const PlayButton = ({ large, handlePlay, item }: IProps) => {
  const isPlaying = usePlayTrack((state) => state.isPlaying);

  const playingTrack = usePlayTrack((state) => state.playingTrack);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handlePlay(item);
      }}
      className="cursor-pointer bg-green-500 grid place-items-center w-8 h-8 md:w-14 md:h-14 rounded-full"
    >
      {item?.uri === playingTrack?.uri && isPlaying ? (
        <FaPause className="text-white" />
      ) : (
        <FaPlay className="text-white" />
      )}
    </div>
  );
};

export default PlayButton;
