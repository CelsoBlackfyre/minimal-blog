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
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...headers,
    },
  });
};

// Handle GET requests
export const get: APIRoute = async ({ request }) => {
  try {
    console.log('API Route: Request received');
    
    // Direct API key for TMDB (this is a public key)
    const apiKey = '3e3166a36a2077f3e58c3efe7058f9ee';
    
    // Get query parameters
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get('page') || '1';
    const genre = searchParams.get('with_genres') || '';
    const sortBy = searchParams.get('sort_by') || 'popularity.desc';

    console.log('Fetching movies with params:', { page, genre, sortBy });

    // Build the TMDB API URL
    const tmdbUrl = new URL('https://api.themoviedb.org/3/discover/movie');
    tmdbUrl.searchParams.append('api_key', apiKey);
    tmdbUrl.searchParams.append('language', 'en-US');
    tmdbUrl.searchParams.append('sort_by', sortBy);
    tmdbUrl.searchParams.append('page', page);
    
    if (genre) {
      tmdbUrl.searchParams.append('with_genres', genre);
    }

    console.log('TMDB API URL:', tmdbUrl.toString());

    // Make request to TMDB API
    const response = await fetch(tmdbUrl.toString());
    const data = await response.json();
    
    if (!response.ok) {
      console.error('TMDB API Error:', response.status, data);
      return createResponse(
        { error: 'Failed to fetch from TMDB API', details: data },
        502
      );
    }
    
    // Transform the response to match our frontend expectations
    const movies: Movie[] = data.results.map((movie: any) => ({
      title: movie.title,
      id: movie.id,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      overview: movie.overview
    }));

    return createResponse({
      results: movies,
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results
    });
  } catch (error) {
    console.error('Error in movies API route:', error);
    return createResponse(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      500
    );
  }
};

// Export the GET handler
export const GET = get;

// Handle OPTIONS for CORS preflight
export const OPTIONS = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
};
