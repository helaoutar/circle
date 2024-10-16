'use client';

import * as React from 'react';
import ReactPaginate from 'react-paginate';

import debounce from '@/lib/utils';

import MoviePoster from '@/components/MoviePoster';

import { Movie } from '@/types';

const API_URL = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&api_key=${process.env.NEXT_PUBLIC_API_KEY}`;

const emptyState = {
  results: [],
  page: 0,
  total_results: 0,
  total_pages: 0,
};

let controller: AbortController;

export default function HomePage() {
  const [query, setQuery] = React.useState('');
  const [movies, setMovies] = React.useState<{
    results: Array<Movie>;
    total_pages: number;
    page: number;
    total_results: number;
  }>(emptyState);

  const searchMovies = React.useCallback(
    debounce((query: string, pageNumber = 1) => {
      controller = new AbortController();
      const signal = controller.signal;

      const url = new URL(API_URL);
      url.searchParams.set('query', query);
      url.searchParams.set('page', pageNumber.toString());

      fetch(url, { signal })
        .then((res) => res.json())
        .then((e) => {
          setMovies(e);
        });
    }, 500),
    []
  );

  React.useEffect(() => {
    if (controller) {
      controller.abort();
    }
    if (query) {
      searchMovies(query);
    } else {
      setMovies(emptyState);
    }
  }, [query]);

  const handlePageClick = (args: { selected: number }) => {
    const { selected } = args;
    searchMovies(query, selected + 1);
  };

  return (
    <main>
      <section className='bg-white container w-full lg:w-2/3 mx-auto py-6 px-4'>
        <input
          className='w-full'
          type='text'
          value={query}
          placeholder='Search'
          onChange={(e) => setQuery(e.target.value)}
        ></input>
        {!!movies.results && (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 py-4'>
              {movies.results.map((movie) => (
                <MoviePoster key={movie.id} movie={movie} />
              ))}
            </div>
            <ReactPaginate
              className='flex w-full gap-4 justify-center'
              breakLabel='...'
              nextLabel='next >'
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={movies.total_pages}
              previousLabel='< previous'
              renderOnZeroPageCount={null}
            />
          </>
        )}
      </section>
    </main>
  );
}
