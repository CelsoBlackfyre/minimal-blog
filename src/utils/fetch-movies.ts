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
    // Use relative URL in production, full URL in development
    const baseUrl = import.meta.env.DEV 
      ? import.meta.env.PUBLIC_API_URL || 'http://localhost:4321'
      : '';
      
    const endpoint = '/api/movies';
    const url = new URL(endpoint, baseUrl);
    
    // Set query parameters
    if (page > 1) url.searchParams.set('page', page.toString());
    if (genre) url.searchParams.set('with_genres', genre);
    
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch movies');
    }

    const data = await response.json();
    
    // Ensure the response matches the MoviesResponse interface
    if (Array.isArray(data)) {
      return {
        results: data,
        page: 1,
        total_pages: 1,
        total_results: data.length
      };
    }
    
    // If it's already in the correct format, return as is
    return data;
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
    const response = await getMovies();
    return response.results.find(movie => movie.id === id);
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return undefined;
  }
}
