import type { APIRoute } from 'astro';

// Sample comics data
const sampleComics = [
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

export const get: APIRoute = async () => {
  return new Response(JSON.stringify(sampleComics), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
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
