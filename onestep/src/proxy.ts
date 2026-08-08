import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "onestep-authenticated";
const VERIFIED_COOKIE = "onestep-email-verified";
const LOGOUT_TOKEN_COOKIE = "onestep-auth-logout-token";
const LOGOUT_TOKEN_EXPIRY_COOKIE = "onestep-auth-logout-token-expiry";

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

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE)?.value === "true";
  const isEmailVerified =
    request.cookies.get(VERIFIED_COOKIE)?.value === "true";
  const logoutToken = request.cookies.get(LOGOUT_TOKEN_COOKIE)?.value;
  const logoutExpiry = Number(
    request.cookies.get(LOGOUT_TOKEN_EXPIRY_COOKIE)?.value ?? "0"
  );

  const isLogoutTokenValid =
    Boolean(logoutToken) && Number.isFinite(logoutExpiry) && logoutExpiry > Date.now();

  const shouldExpireSession = isAuthenticated && !isLogoutTokenValid;

  if (shouldExpireSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);

    const response = NextResponse.redirect(loginUrl);
    response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
    response.cookies.set(VERIFIED_COOKIE, "", { path: "/", maxAge: 0 });
    response.cookies.set(LOGOUT_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
    response.cookies.set(LOGOUT_TOKEN_EXPIRY_COOKIE, "", {
      path: "/",
      maxAge: 0,
    });
    return response;
  }

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
