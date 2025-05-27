// TVShow type definition
export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
}

export async function getTVShows(): Promise<TVShow[]> {
  // Return sample data during build
  if (import.meta.env.SSR) {
    return [
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
  }

  // In the browser, fetch from our API
  try {
    const response = await fetch('/api/tvshows');
    if (!response.ok) {
      throw new Error('Failed to fetch TV shows');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return [];
  }
}
