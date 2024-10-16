import Image from 'next/image';

import { Movie } from '@/types';

type Props = {
  movie: Movie;
};
const POSTER_BASE_PATH = `https://image.tmdb.org/t/p/w300`;

const MoviePoster = ({ movie }: Props) => {
  return (
    <div className=''>
      <div className='h-96 lg:h-80 relative mb-2'>
        <Image
          src={`${POSTER_BASE_PATH}/${movie.poster_path}`}
          alt=''
          fill
          objectFit='cover'
        />
      </div>
      <p className='text-xl font-semibold'>{movie.title}</p>
    </div>
  );
};

export default MoviePoster;
