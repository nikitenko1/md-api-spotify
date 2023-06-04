import React from "react";
import Card from "./Card";
import NoImage from "../../public/no-image.jpg";
import Image from "next/legacy/image";
import timeConversion from "../helpers/timeConversion";

interface IProps {
  episode: SpotifyApi.EpisodeObjectSimplified;
}

const EpisodeSearchItem = ({ episode }: IProps) => {
  return (
    <div>
      <Card>
        <div className="space-y-3 relative">
          <div className="relative">
            <Image
              src={episode?.images[0]?.url ?? NoImage}
              height={150}
              width={150}
              objectFit="cover"
              className="rounded-md"
              alt="playlist"
            />
          </div>
          <p className="font-semibold text-white">{episode.name.slice(0, 15)}</p>
          <p className="text-gray-400 text-sm">
            {episode.release_date} . {timeConversion(episode.duration_ms)}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EpisodeSearchItem;
