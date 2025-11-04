import { NextResponse } from "next/server";
import { apiLogger } from "./apiLogger";

export function logApiCall(request: Request, handler: (request: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const startTime = Date.now();
    const logId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const url = new URL(req.url);

    // Log request
    let requestBody: unknown;
    try {
      if (req.method !== "GET" && req.method !== "DELETE") {
        const clonedRequest = req.clone();
        requestBody = await clonedRequest.json();
      }
    } catch {
      // Body might not be JSON
    }

    const logEntry = {
      id: logId,
      timestamp: new Date().toISOString(),
      method: req.method,
      path: url.pathname + url.search,
      requestBody,

      headers: Object.fromEntries(req.headers.entries()),
    };

    try {
      const response = await handler(req);
      const duration = Date.now() - startTime;

      // Clone response to read body
      let responseBody: unknown;
      try {
        const clonedResponse = response.clone();
        responseBody = await clonedResponse.json();
      } catch {
        // Response might not be JSON
      }

      apiLogger.log({
        ...logEntry,
        status: response.status,
        duration,
        responseBody,
      });

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      apiLogger.log({
        ...logEntry,
        status: 500,
        duration,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  };
}
