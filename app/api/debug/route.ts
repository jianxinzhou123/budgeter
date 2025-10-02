import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Collect debug information
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),

      // API Routes Status
      apiRoutes: [
        '/api/categories',
        '/api/categories/[id]',
        '/api/transactions',
        '/api/transactions/[id]',
        '/api/summary',
      ],

      // Environment variables (safe ones only)
      env: {
        NODE_ENV: process.env.NODE_ENV,
        // Add any other safe env vars you want to check
      },

      // Request info
      nextUrl: {
        pathname: request.nextUrl.pathname,
        searchParams: Object.fromEntries(request.nextUrl.searchParams),
      },
    };

    return Response.json(debugInfo, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Debug endpoint error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
