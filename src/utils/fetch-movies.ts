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

// Base URL for TMDB API
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to get the base URL based on the environment
function getBaseUrl() {
  // Client-side: use relative URL
  if (typeof window !== 'undefined') return '';
  
  // Server-side: construct absolute URL
  // Vercel provides VERCEL_URL for serverless functions
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Check for custom PUBLIC_API_URL
  const publicApiUrl = process.env.PUBLIC_API_URL || import.meta.env.PUBLIC_API_URL;
  if (publicApiUrl) return publicApiUrl;
  
  // Fallback for local development
  return 'http://localhost:4321';
}

// Helper to get API key with fallbacks
function getApiKey() {
  // Try different ways to get the API key
  return (
    process.env.TMDB_API_KEY || // Vercel environment
    import.meta.env.TMDB_API_KEY || // Vite environment
    process.env.NEXT_PUBLIC_TMDB_API_KEY || // Common Next.js pattern
    import.meta.env.PUBLIC_TMDB_API_KEY // Vite public env var
  );
}

export async function getMovies(page: number = 1, genre?: string): Promise<MoviesResponse> {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('TMDB API key is not configured');
    }

    // Build the TMDB API URL
    const params = new URLSearchParams({
      api_key: apiKey,
      language: 'en-US',
      page: page.toString(),
      sort_by: 'popularity.desc',
      include_adult: 'false',
      include_video: 'false'
    });
    
    if (genre) params.set('with_genres', genre);
    
    const url = `${TMDB_BASE_URL}/movie/now_playing?${params.toString()}`;
    
    console.log('Fetching movies from TMDB API:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch movies from TMDB:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform TMDB response to our MoviesResponse interface
    return {
      results: data.results || [],
      page: data.page || 1,
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0
    };
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
