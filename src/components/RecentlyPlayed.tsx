import Link from "next/link";
import { IRecentlyPlayed, ITrack } from "../../interface";
import Image from "next/legacy/image";

interface IProps {
  track: IRecentlyPlayed;
}

const RecentlyPlayed = ({ track }: IProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Image
        src={track?.track.album.images[1].url}
        alt="album-image"
        className="rounded-full w-[52px] h-[52px]"
      />
      <div>
        <Link href={`/album/${track?.track.album.id}`}>
          <h4
            className="text-white text-[13px] mb-0.5 font-semibold hover:underline cursor-pointer 
          truncate max-w-[150px]"
          >
            {track?.track.name}
          </h4>
        </Link>

        <Link href={`/artist/${track.track.artists[0].id}`}>
          <p className="text-xs text-[#686868] font-semibold cursor-pointer hover:underline">
            {track?.track.artists[0]?.name}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default RecentlyPlayed;
