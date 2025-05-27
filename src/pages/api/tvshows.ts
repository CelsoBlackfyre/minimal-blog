import type { APIRoute } from 'astro';

// TMDB API configuration
const TMDB_API_KEY = import.meta.env.TMDB_API_KEY || process.env.TMDB_API_KEY;

// Fetch TV shows from TMDB API
export const get: APIRoute = async ({ request }) => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured');
    }

    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    
    // For now, return sample data
    const shows = [
      {
        id: 1,
        name: "Sample TV Show 1",
        poster_path: "/placeholder.jpg",
        overview: "This is a sample TV show description.",
        first_air_date: "2023-01-01",
        vote_average: 7.5
      },
      {
        id: 2,
        name: "Sample TV Show 2",
        poster_path: "/placeholder.jpg",
        overview: "Another sample TV show description.",
        first_air_date: "2023-02-15",
        vote_average: 8.0
      },
      {
        id: 3,
        name: "Sample TV Show 3",
        poster_path: "/placeholder.jpg",
        overview: "Yet another sample TV show.",
        first_air_date: "2023-03-30",
        vote_average: 6.8
      }
    ];

    return new Response(JSON.stringify(shows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch TV shows',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
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
    },
  });
};
