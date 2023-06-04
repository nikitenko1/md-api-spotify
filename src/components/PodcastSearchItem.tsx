import React from "react";
import Card from "./Card";
import NoImage from "../../public/no-image.jpg";
import Link from "next/link";
import Image from "next/legacy/image";

interface IProps {
  show: SpotifyApi.ShowObjectSimplified;
}

const PodcastSearchItem = ({ show }: IProps) => {
  return (
    <Card>
      <Link href={`/show/${show.id}`}>
        <div className="space-y-3 relative">
          <div className="relative">
            <Image
              src={show.images[0].url ?? NoImage}
              height={150}
              width={150}
              className="rounded-md"
              alt="podcast"
            />
          </div>

          <p className="font-semibold text-white w-[120px] truncate">{show.name}</p>
        </div>
      </Link>
    </Card>
  );
};

export default PodcastSearchItem;
