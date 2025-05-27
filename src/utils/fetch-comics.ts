export interface Comic {
  id: number;
  title: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  description?: string;
  modified: string;
}

export async function getComics(): Promise<Comic[]> {
  // Return sample data during build
  if (import.meta.env.SSR) {
    return [
      {
        id: 1,
        title: "Sample Comic 1",
        thumbnail: {
          path: "/placeholder",
          extension: "jpg"
        },
        description: "This is a sample comic description.",
        modified: "2023-01-01T00:00:00-0500"
      },
      {
        id: 2,
        title: "Sample Comic 2",
        thumbnail: {
          path: "/placeholder",
          extension: "jpg"
        },
        description: "Another sample comic description.",
        modified: "2023-02-15T00:00:00-0500"
      },
      {
        id: 3,
        title: "Sample Comic 3",
        thumbnail: {
          path: "/placeholder",
          extension: "jpg"
        },
        description: "Yet another sample comic.",
        modified: "2023-03-30T00:00:00-0400"
      }
    ];
  }

  // In the browser, fetch from our API
  try {
    const response = await fetch('/api/comics');
    if (!response.ok) {
      throw new Error('Failed to fetch comics');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching comics:', error);
    return [];
  }
}
