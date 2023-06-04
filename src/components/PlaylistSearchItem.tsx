import React from "react";
import useHandlePlay from "../hooks/useHandlePlay";
import Card from "./Card";
import Link from "next/link";
import Image from "next/legacy/image";
import NoImage from "../../public/no-image.jpg";
import PlayButton from "./PlayButton";
import { useHover } from "usehooks-ts";
import { useRef } from "react";

interface IProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

const PlaylistSearchItem = ({ playlist }: IProps) => {
  const hoverRef = useRef(null);
  // React UI sensor hook that determine if the mouse element is in the hover element
  // using Javascript Typescript instead CSS
  const isHover = useHover(hoverRef);

  const handlePlay = useHandlePlay();

  return (
    <div ref={hoverRef}>
      <Card>
        <Link href={`/playlist/${playlist.id}`}>
          <div className="space-y-3 relative">
            <div className="relative">
              <Image
                src={playlist?.images[0]?.url ?? NoImage}
                height={150}
                width={150}
                objectFit="cover"
                className="rounded-md"
                alt="playlist"
              />
              {isHover && (
                <div className="absolute bottom-4 right-4">
                  <PlayButton handlePlay={() => handlePlay(playlist)} item={playlist} />
                </div>
              )}
            </div>
            <p className="text-gray-400 capitalize">
              by {playlist?.owner.display_name ?? "Unknown"}
            </p>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default PlaylistSearchItem;
