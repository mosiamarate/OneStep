import "server-only";

import { cookies } from "next/headers";

import { adminAuth } from "./firebase-admin";

export const AUTH_SESSION_COOKIE = "onestep-session";
export const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export async function createAuthSession(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: AUTH_SESSION_MAX_AGE_SECONDS * 1000,
  });
  const cookieStore = await cookies();

  cookieStore.set(AUTH_SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
  });

  return decodedToken.uid;
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}