import { getComics } from '../utils/fetch-comics';

export async function getLatestComicCover() {
  const comics = await getComics();
  if (comics && comics.length > 0) {
    // Get the first comic's image URL
    return comics[0].imageUrl || '/default-cover.jpg';
  }
  return '/default-cover.jpg';
}
