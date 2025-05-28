import type { APIRoute } from 'astro';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Your secret API key for build-time authentication (set in Vercel/project env)
const BUILD_API_KEY =
  import.meta.env.MOVIE_API_KEY ||
  process.env.MOVIE_API_KEY;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // --- AUTHENTICATION: Require Authorization header ---
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${BUILD_API_KEY}`) {
      // Log unauthorized attempts (optional, for debug)
      console.warn("Unauthorized access attempt to /api/movies", {
        hasHeader: !!authHeader,
        value: authHeader,
        expected: `Bearer ${BUILD_API_KEY?.slice(0, 6)}...`
      });
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Missing or invalid API key.' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get TMDB API key (unchanged from your original logic)
    const apiKey = (
      import.meta.env.TMDB_API_KEY ||
      process.env.TMDB_API_KEY ||
      process.env.NEXT_PUBLIC_TMDB_API_KEY ||
      import.meta.env.PUBLIC_TMDB_API_KEY
    );

    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuration Error',
          message: 'TMDB API key is not properly configured'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const genre = url.searchParams.get('with_genres') || '';

    // Build TMDB API URL
    const tmdbUrl = new URL('https://api.themoviedb.org/3/movie/now_playing');
    tmdbUrl.searchParams.append('api_key', apiKey);
    tmdbUrl.searchParams.append('language', 'en-US');
    tmdbUrl.searchParams.append('page', page);
    if (genre) {
      tmdbUrl.searchParams.append('with_genres', genre);
    }

    const response = await fetch(tmdbUrl.toString());
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}: ${errorText}`);
    }

    const data = await response.json();

    // Standardize response
    const result = {
      results: data.results || [],
      page: data.page || 1,
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch movies',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
};
