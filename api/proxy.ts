export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  // Get the path and query from the request
  const url = new URL(request.url)
  const pathSegments = url.pathname.replace('/api/proxy', '')
  const queryString = url.search
  
  // Build the target URL for Moltbook API
  const targetUrl = `https://api.moltbook.com/v1${pathSegments}${queryString}`
  
  // Get the request body if it exists
  let body = null
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.text()
    } catch (e) {
      // No body or error reading body
    }
  }
  
  // Forward the request to Moltbook API
  const headers = new Headers()
  
  // Copy relevant headers from the original request
  const authHeader = request.headers.get('Authorization')
  if (authHeader) {
    headers.set('Authorization', authHeader)
  }
  
  headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json')
  headers.set('Accept', 'application/json')
  
  try {
    // Make the request to Moltbook API
    const apiResponse = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
    })
    
    // Get the response data
    const responseData = await apiResponse.text()
    
    // Create response with CORS headers
    const response = new Response(responseData, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: {
        'Content-Type': apiResponse.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
    
    return response
  } catch (error) {
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'PROXY_ERROR',
          message: error instanceof Error ? error.message : 'Failed to connect to Moltbook API',
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  }
}
