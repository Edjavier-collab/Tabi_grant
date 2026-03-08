import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add the paths that should NOT be blocked if the user isn't logged in
const publicApiRoutes = [
    '/api/auth/callback/google',
    '/api/auth/gmail',
    '/api/auth/gmail/status'
];

export function middleware(request: NextRequest) {
    // Only apply this logic to API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        // Skip protection for public routes
        if (publicApiRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
            return NextResponse.next();
        }

        // Check for the uid cookie set in AuthContext upon login
        const uid = request.cookies.get('uid')?.value;

        if (!uid) {
            // Return 401 Unauthorized JSON response if missing
            return NextResponse.json(
                { error: 'Unauthorized: Authentication required to access this API route.' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    // Apply this middleware only to /api/* routes
    matcher: '/api/:path*',
};
