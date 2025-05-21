export async function getTVShows() {
    const res = await fetch("http://localhost:8080/api/tvshows")
    const data = await res.json()
    return Array.isArray(data) ? data : [];
}
