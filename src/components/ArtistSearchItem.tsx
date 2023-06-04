import { useRef } from "react";
import { useHover } from "usehooks-ts";
import useHandlePlay from "../hooks/useHandlePlay";
import Card from "./Card";
import Link from "next/link";
import Image from "next/legacy/image";
import NoImage from "../../public/no-image.jpg";
import PlayButton from "./PlayButton";

interface IProps {
  artist: SpotifyApi.ArtistObjectFull;
}

const ArtistSearchItem = ({ artist }: IProps) => {
  const hoverRef = useRef(null);
  // React UI sensor hook that determine if the mouse element is in the hover element
  // using Javascript Typescript instead CSS
  const isHover = useHover(hoverRef);

  const handlePlay = useHandlePlay();

  return (
    <div ref={hoverRef}>
      <Card>
        <Link href={`/artist/${artist.id}`}>
          <div className="space-y-3 relative">
            <div className="relative">
              <Image
                src={artist?.images[0]?.url ?? NoImage}
                height={150}
                width={150}
                className="rounded-full "
                objectFit="cover"
                alt="artist"
              />
              {isHover && (
                <div className="absolute bottom-4 right-4 ">
                  <PlayButton handlePlay={() => handlePlay(artist)} item={artist} />
                </div>
              )}
            </div>
            <p className="font-semibold text-white capitalize truncate">{artist.name}</p>
            <p className="text-gray-400 capitalize">{artist.type}</p>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default ArtistSearchItem;
