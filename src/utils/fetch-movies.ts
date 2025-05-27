export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
}

export interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

// Helper function to get the base URL based on the environment
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In the browser, use relative URL
    return '';
  }
  // On server, use the full URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default to local development
  return 'http://localhost:4321';
}

export async function getMovies(page: number = 1, genre?: string): Promise<MoviesResponse> {
  try {
    console.log('Fetching movies...');
    const params = new URLSearchParams({
      page: page.toString(),
      ...(genre && { with_genres: genre })
    });

    // Get the base URL based on the environment
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/movies?${params.toString()}`;
    console.log('API URL:', apiUrl);
    
    const res = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Only set credentials for client-side requests
      ...(typeof window !== 'undefined' && { credentials: 'same-origin' })
    });
    
    const responseText = await res.text();
    console.log('API Response Status:', res.status);
    
    if (!res.ok) {
      console.error('API Error Response:', responseText);
      throw new Error(`Failed to fetch movies (${res.status}): ${responseText}`);
    }
    
    let data: MoviesResponse;
    try {
      data = JSON.parse(responseText);
      console.log(`Successfully fetched ${data.results?.length || 0} movies`);
    } catch (e) {
      console.error('Failed to parse API response:', e);
      throw new Error('Invalid JSON response from API');
    }
    
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