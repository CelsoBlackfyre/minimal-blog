// import type { APIRoute } from 'astro';

// // CORS headers
// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'GET, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };

// export const GET: APIRoute = async ({ request }) => {
//   try {
//     // Handle OPTIONS request for CORS preflight
//     if (request.method === 'OPTIONS') {
//       return new Response(null, {
//         status: 204,
//         headers: corsHeaders,
//       });
//     }

//     // Return empty response with disabled message
//     return new Response(
//       JSON.stringify({ 
//         results: [],
//         page: 1,
//         total_results: 0,
//         message: 'Movie fetching is currently disabled',
//       }), {
//         status: 200,
//         headers: { 
//           'Content-Type': 'application/json',
//           'Cache-Control': 'public, max-age=3600',
//           ...corsHeaders
//         }
//       }
//     );
    
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ 
//         error: 'Failed to fetch movies',
//         message: error instanceof Error ? error.message : 'Unknown error'
//       }), {
//         status: 500,
//         headers: { 'Content-Type': 'application/json', ...corsHeaders }
//       }
//     );
//   }
// };
