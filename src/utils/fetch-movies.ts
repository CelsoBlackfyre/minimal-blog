export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  [key: string]: any;
}

export interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

/**
 * Fetches movies from the TMDB API via our API route
 */
export async function getMovies(page: number = 1, genre?: string): Promise<MoviesResponse> {
  // During build time, return an empty array
  if (import.meta.env.SSR) {
    return { results: [], page: 1, total_pages: 1, total_results: 0 };
  }
  
  try {
    const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:4321/api/movies';
    const url = new URL(apiUrl);
    
    // Set query parameters
    if (page > 1) url.searchParams.set('page', page.toString());
    if (genre) url.searchParams.set('with_genres', genre);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch movies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    // Return empty results on error to prevent UI breakage
    return {
      results: [],
      page: 1,
      total_pages: 0,
      total_results: 0
    };
  }
}

/**
 * Fetches a single movie by ID
 */
export async function getMovieById(id: number): Promise<Movie | undefined> {
  try {
    // We need to fetch all movies and filter by ID since TMDB's discover endpoint doesn't support direct ID lookup
    const response = await getMovies();
    return response.results.find(movie => movie.id === id);
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return undefined;
  }
}
