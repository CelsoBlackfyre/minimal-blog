import type { APIRoute } from 'astro';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const GET: APIRoute = async ({ request }) => {
  try {
    // Handle OPTIONS request for CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Get API key with fallbacks
    const apiKey = (
      import.meta.env.TMDB_API_KEY ||
      process.env.TMDB_API_KEY ||
      process.env.NEXT_PUBLIC_TMDB_API_KEY ||
      import.meta.env.PUBLIC_TMDB_API_KEY
    );

    // Debug log (remove in production)
    console.log('API Key Status:', {
      hasApiKey: !!apiKey,
      keyLength: apiKey ? apiKey.length : 0,
      env: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV
    });

    if (!apiKey) {
      const errorMsg = 'TMDB API key is not properly configured';
      console.error(errorMsg, {
        availableEnvVars: Object.keys(process.env).filter(k => k.includes('TMDB') || k.includes('VERCEL')),
        importMetaEnv: Object.keys(import.meta.env)
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Configuration Error',
          message: errorMsg,
          help: 'Please ensure TMDB_API_KEY is set in your environment variables'
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
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
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Error in /api/movies:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch movies',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
};
