const AUTH_COOKIE = "onestep-authenticated";
const VERIFIED_COOKIE = "onestep-email-verified";
const LOGOUT_TOKEN_COOKIE = "onestep-auth-logout-token";
const LOGOUT_TOKEN_EXPIRY_COOKIE = "onestep-auth-logout-token-expiry";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const LOGOUT_TOKEN_MAX_AGE = 60 * 60 * 24; // 24 hours

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

export function createLogoutToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function isLogoutTokenExpired() {
  const token = getCookieValue(LOGOUT_TOKEN_COOKIE);
  const expiry = getCookieValue(LOGOUT_TOKEN_EXPIRY_COOKIE);

  if (!token || !expiry) {
    return true;
  }

  const expiryNumber = Number(expiry);
  return Number.isNaN(expiryNumber) || expiryNumber <= Date.now();
}

export function setAuthCookie(
  isAuthenticated: boolean,
  isEmailVerified = false,
  logoutToken?: string
) {
  if (typeof document === "undefined") return;

  if (!isAuthenticated) {
    clearCookie(AUTH_COOKIE);
    clearCookie(VERIFIED_COOKIE);
    clearCookie(LOGOUT_TOKEN_COOKIE);
    clearCookie(LOGOUT_TOKEN_EXPIRY_COOKIE);
    return;
  }

  setCookie(AUTH_COOKIE, "true", AUTH_COOKIE_MAX_AGE);
  setCookie(VERIFIED_COOKIE, String(isEmailVerified), AUTH_COOKIE_MAX_AGE);

  if (logoutToken) {
    setCookie(LOGOUT_TOKEN_COOKIE, logoutToken, LOGOUT_TOKEN_MAX_AGE);
    setCookie(
      LOGOUT_TOKEN_EXPIRY_COOKIE,
      String(Date.now() + LOGOUT_TOKEN_MAX_AGE * 1000),
      LOGOUT_TOKEN_MAX_AGE
    );
  }
}

export function clearAuthCookies() {
  clearCookie(AUTH_COOKIE);
  clearCookie(VERIFIED_COOKIE);
  clearCookie(LOGOUT_TOKEN_COOKIE);
  clearCookie(LOGOUT_TOKEN_EXPIRY_COOKIE);
}

export function getLogoutTokenCookie() {
  return getCookieValue(LOGOUT_TOKEN_COOKIE);
}

export function getLogoutTokenExpiryCookie() {
  const value = getCookieValue(LOGOUT_TOKEN_EXPIRY_COOKIE);
  return value ? Number(value) : null;
}

export function hasVerifiedEmailCookie() {
  return getCookieValue(VERIFIED_COOKIE) === "true";
}
