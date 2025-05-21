export async function getMovies() {
    const res = await fetch("http://localhost:8080/api/movies")
    const data = await res.json()
    return Array.isArray(data) ? data : [];
}