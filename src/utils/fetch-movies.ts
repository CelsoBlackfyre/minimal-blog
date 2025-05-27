// Use environment variable for the API URL with fallback to empty array in static generation
export async function getMovies() {
    // During build time, return an empty array
    if (import.meta.env.SSR) {
        return [];
    }
    
    // At runtime, fetch from the API
    try {
        const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:8080/api/movies';
        const res = await fetch(apiUrl);
        if (!res.ok) {
            console.error('Failed to fetch movies:', res.statusText);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}