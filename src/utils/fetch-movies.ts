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

export async function getMovies(page: number = 1, genre?: string): Promise<MoviesResponse> {
  try {
    let endpoint = `/api/movies?page=${page}`;
    if (genre) endpoint += `&with_genres=${encodeURIComponent(genre)}`;

    let fetchUrl = endpoint;

    // SSR (Node): must use absolute URL
    if (typeof window === 'undefined') {
      // On Vercel: prefer process.env.URL or process.env.VERCEL_URL (set this in Vercel Env Vars)
      const base =
        process.env.URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:4321');
      fetchUrl = base + endpoint;
    }

    const response = await fetch(fetchUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch movies');
    }

    const data = await response.json();
    // Enforce MoviesResponse structure
    if (Array.isArray(data)) {
      return {
        results: data,
        page: 1,
        total_pages: 1,
        total_results: data.length
      };
    }
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      results: [],
      page: 1,
      total_pages: 0,
      total_results: 0
    };
  }
}


export async function getMovieById(id: number): Promise<Movie | undefined> {
  try {
    const response = await getMovies();
    return response.results.find(movie => movie.id === id);
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return undefined;
  }
}
