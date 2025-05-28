import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Verify API key is configured
    const apiKey = import.meta.env.TMDB_API_KEY;
    if (!apiKey) {
      console.error('TMDB_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
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

    console.log('Fetching from TMDB:', tmdbUrl.toString());
    
    // Make request to TMDB
    const response = await fetch(tmdbUrl.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Standardize response
    const result = {
      results: data.results || [],
      page: data.page || 1,
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
    };

    console.log(`Fetched ${result.results.length} movies from TMDB`);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
    
  } catch (error) {
    console.error('Error in /api/movies:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch movies',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
