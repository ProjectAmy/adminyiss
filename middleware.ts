import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    // Debug logging
    console.log(`[Middleware] Processing path: ${req.nextUrl.pathname}`);

    const isLoggedIn = !!req.auth;
    const isProtectedRoute =
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/add") ||
        req.nextUrl.pathname.startsWith("/list");

    console.log(`[Middleware] State:`, {
        isLoggedIn,
        isProtectedRoute,
        path: req.nextUrl.pathname
    });

    // Logic 1: Unauthenticated user trying to access protected route -> Redirect to Home (Login)
    if (!isLoggedIn && isProtectedRoute) {
        console.log(`[Middleware] Redirecting to / (Not logged in trying to access protected)`);
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // Logic 2: Authenticated user trying to access Home (Login) -> Redirect to Dashboard
    if (isLoggedIn && req.nextUrl.pathname === "/") {
        console.log(`[Middleware] Redirecting to /dashboard (Logged in user on landing page)`);
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
