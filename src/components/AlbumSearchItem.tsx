import { useRef } from "react";
import { useHover } from "usehooks-ts";
import useHandlePlay from "../hooks/useHandlePlay";
import Card from "./Card";
import Link from "next/link";
import PlayButton from "./PlayButton";
import Image from "next/legacy/image";
import NoImage from "../../public/no-image.jpg";

interface IProps {
  album: SpotifyApi.AlbumObjectSimplified;
}

const AlbumSearchItem = ({ album }: IProps) => {
  const hoverRef = useRef(null);
  // React UI sensor hook that determine if the mouse element is in the hover element
  // using Javascript Typescript instead CSS
  const isHover = useHover(hoverRef);

  const handlePlay = useHandlePlay();

  return (
    <div ref={hoverRef}>
      <Card>
        <Link href={`/album/${album.id}`}>
          <div className="space-y-3 relative">
            <div className="relative">
              <Image
                src={album.images[0].url ?? NoImage}
                height={150}
                width={150}
                className="rounded-md"
                alt="album"
              />
              {isHover && (
                <div
                  className="w-10   absolute bottom-4 right-2 h-10 rounded-full bg-green-500 grid
                 place-items-center"
                >
                  <PlayButton handlePlay={() => handlePlay(album)} item={album} />
                </div>
              )}
            </div>
            <p className="font-semibold text-white truncate">{album.name}</p>
            <p className="text-gray-400 ">
              {album.release_date.slice(0, 4)} {album.artists[0].name}
            </p>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default AlbumSearchItem;
