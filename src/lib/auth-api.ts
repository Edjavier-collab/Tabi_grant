import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type ApiHandler = (req: NextRequest, context: any) => Promise<NextResponse>;

const publicApiRoutes = [
    '/api/auth/callback/google',
    '/api/auth/gmail',
    '/api/auth/gmail/status'
];

/**
 * Higher-order function to protect API routes.
 * Use this to wrap your route handlers.
 */
export function withAuth(handler: ApiHandler) {
    return async (req: NextRequest, context: any) => {
        const pathname = req.nextUrl.pathname;

        // Skip protection for public routes
        if (publicApiRoutes.some(route => pathname.startsWith(route))) {
            return handler(req, context);
        }

        const cookieStore = await cookies();
        const uid = cookieStore.get('uid')?.value;

        if (!uid) {
            return NextResponse.json(
                { error: 'Unauthorized: Authentication required' },
                { status: 401 }
            );
        }

        return handler(req, context);
    };
}
