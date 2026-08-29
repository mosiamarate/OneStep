import { NextRequest, NextResponse } from "next/server";

import { adminAuth } from "./lib/firebase-admin";
import { AUTH_SESSION_COOKIE } from "./lib/authSession";


const protectedRoutes = [
  "/dashboard",
  "/focus",
  "/history",
  "/mood",
  "/task",
  "/settings",
];

const authRoutes = [
  "/auth/forgot-password",
  "/auth/login",
  "/auth/reset-password",
  "/auth/signup",
];

const verificationRoute = "/auth/verify-email";

function isRouteMatch(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  let session: { email_verified?: boolean } | null = null;

  if (sessionCookie) {
    try {
      session = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch {
      if (!isRouteMatch(pathname, protectedRoutes)) {
        return NextResponse.next();
      }

      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);

      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(AUTH_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
      return response;
    }
  }

  const isAuthenticated = Boolean(session);
  const isEmailVerified = session?.email_verified === true;

  if (!isAuthenticated && isRouteMatch(pathname, protectedRoutes)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (
    isAuthenticated &&
    !isEmailVerified &&
    isRouteMatch(pathname, protectedRoutes)
  ) {
    const verifyUrl = request.nextUrl.clone();
    verifyUrl.pathname = verificationRoute;
    verifyUrl.searchParams.set("redirectTo", `${pathname}${search}`);

    return NextResponse.redirect(verifyUrl);
  }

  if (isAuthenticated && isEmailVerified && pathname === verificationRoute) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";

    return NextResponse.redirect(dashboardUrl);
  }

  if (isAuthenticated && isRouteMatch(pathname, authRoutes)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = isEmailVerified ? "/dashboard" : verificationRoute;
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/focus/:path*",
    "/history/:path*",
    "/mood/:path*",
    "/task/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};
