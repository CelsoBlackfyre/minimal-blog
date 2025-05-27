import type { APIRoute } from 'astro';

interface Movie {
  title: string;
  id: number;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  [key: string]: any;
}

// CORS headers
const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Cache-Control': 'public, s-maxage=3600' // Cache for 1 hour
};

// Helper to create a response with CORS headers
const createResponse = (data: any, status = 200, headers: Record<string, string> = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, ...headers },
  });
};

// TMDB API configuration
const TMDB_API_KEY = import.meta.env.TMDB_API_KEY || process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Cache configuration
const CACHE_TTL = 60 * 60; // 1 hour in seconds

// Fetch movies from TMDB API
export const get: APIRoute = async ({ request }) => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured');
    }

    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const genre = url.searchParams.get('with_genres') || '';
    const sortBy = url.searchParams.get('sort_by') || 'popularity.desc';

    // Build TMDB API URL
    const apiUrl = new URL(`${TMDB_BASE_URL}/discover/movie`);
    apiUrl.searchParams.append('api_key', TMDB_API_KEY);
    apiUrl.searchParams.append('language', 'en-US');
    apiUrl.searchParams.append('page', page);
    apiUrl.searchParams.append('sort_by', sortBy);
    
    if (genre) {
      apiUrl.searchParams.append('with_genres', genre);
    }

    // Make request to TMDB API
    const response = await fetch(apiUrl.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('TMDB API Error:', errorData);
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the response to match our frontend expectations
    const movies = {
      ...data,
      results: data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      }))
    };

    return new Response(JSON.stringify(movies), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}, stale-while-revalidate=60`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch movies',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
};

// Handle OPTIONS requests for CORS preflight
export const options: APIRoute = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'GET, OPTIONS, HEAD',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    },
  });
};
