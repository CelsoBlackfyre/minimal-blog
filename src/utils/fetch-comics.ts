export async function getComics() {
    const res = await fetch("http://localhost:8080/api/comics")
    const data = await res.json()
    return Array.isArray(data) ? data : [];
}
