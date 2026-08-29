const AUTH_COOKIE = "onestep-authenticated";
const VERIFIED_COOKIE = "onestep-email-verified";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; sameSite=lax`;
}

function clearCookie(name: string) {
  setCookie(name, "", 0);
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;

  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1] ?? null;
}

export function setAuthCookie(isAuthenticated: boolean, isEmailVerified = false) {
  if (typeof document === "undefined") return;

  if (!isAuthenticated) {
    clearCookie(AUTH_COOKIE);
    clearCookie(VERIFIED_COOKIE);
    return;
  }

  setCookie(AUTH_COOKIE, "true", AUTH_COOKIE_MAX_AGE);
  setCookie(VERIFIED_COOKIE, String(isEmailVerified), AUTH_COOKIE_MAX_AGE);

}

export function clearAuthCookies() {
  clearCookie(AUTH_COOKIE);
  clearCookie(VERIFIED_COOKIE);
}

export function hasVerifiedEmailCookie() {
  return getCookieValue(VERIFIED_COOKIE) === "true";
}
