const AUTH_COOKIE = "onestep-authenticated";
const VERIFIED_COOKIE = "onestep-email-verified";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; sameSite=lax`;
}

export function setAuthCookie(
  isAuthenticated: boolean,
  isEmailVerified = false
) {
  if (typeof document === "undefined") return;

  if (isAuthenticated) {
    setCookie(AUTH_COOKIE, "true", AUTH_COOKIE_MAX_AGE);
    setCookie(VERIFIED_COOKIE, String(isEmailVerified), AUTH_COOKIE_MAX_AGE);
    return;
  }

  setCookie(AUTH_COOKIE, "", 0);
  setCookie(VERIFIED_COOKIE, "", 0);
}

export function hasVerifiedEmailCookie() {
  if (typeof document === "undefined") return false;

  return document.cookie
    .split("; ")
    .some((cookie) => cookie === `${VERIFIED_COOKIE}=true`);
}
