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

// Helper function to get the base URL based on the environment
function getBaseUrl() {
  // Client-side: use relative URL
  if (typeof window !== 'undefined') return '';
  
  // Server-side: construct absolute URL
  // Vercel provides VERCEL_URL for serverless functions
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback for local development
  return 'http://localhost:4321';
}

export async function getMovies(page: number = 1, genre?: string): Promise<MoviesResponse> {
  try {
    // Build the endpoint with query parameters
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (genre) params.set('with_genres', genre);
    
    const endpoint = `/api/movies?${params.toString()}`;
    const baseUrl = getBaseUrl();
    const fetchUrl = `${baseUrl}${endpoint}`;
    
    console.log('Fetching movies from:', fetchUrl);
    
    const response = await fetch(fetchUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch movies:', {
        status: response.status,
        statusText: response.statusText,
        url: fetchUrl,
        error: errorText
      });
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Ensure the response matches our MoviesResponse interface
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
