import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db, googleProvider } from "../lib/firebase";
import {
  setAuthCookie,
  clearAuthCookies,
} from "./authCookie";

async function establishAuthSession(user: { getIdToken: () => Promise<string> }) {
  const token = await user.getIdToken();
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Unable to create a secure session.");
  }
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  try {
    await establishAuthSession(userCredential.user);
  } catch (error) {
    await signOut(auth);
    throw error;
  }
  setAuthCookie(true, userCredential.user.emailVerified);

  return userCredential;
}

export async function signupUser(
  fullName: string,
  email: string,
  password: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  try {
    await updateProfile(userCredential.user, { displayName: fullName });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      fullName,
      email,
      provider: "password",
      emailOtpVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    try {
      await userCredential.user.delete();
    } catch {
      throw new Error(
        "Your account was created, but profile setup did not finish. Please sign in to continue."
      );
    }
    throw error;
  }

  try {
    await establishAuthSession(userCredential.user);
  } catch {
    await signOut(auth);
    throw new Error(
      "Your account was created, but we couldn’t start a secure session. Please sign in to continue."
    );
  }
  setAuthCookie(true, false);

  return userCredential;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const extraInfo = getAdditionalUserInfo(result);

  await setDoc(
    doc(db, "users", result.user.uid),
    {
      uid: result.user.uid,
      fullName: result.user.displayName || "",
      email: result.user.email || "",
      provider: "google",
      emailOtpVerified: true,
      isNewUser: extraInfo?.isNewUser || false,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );

  try {
    await establishAuthSession(result.user);
  } catch (error) {
    await signOut(auth);
    throw error;
  }
  setAuthCookie(true, true);

  return result;
}

export async function signupWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const extraInfo = getAdditionalUserInfo(result);

  await setDoc(
    doc(db, "users", result.user.uid),
    {
      uid: result.user.uid,
      fullName: result.user.displayName || "",
      email: result.user.email || "",
      photoURL: result.user.photoURL || "",
      provider: "google",
      emailOtpVerified: true,
      isNewUser: extraInfo?.isNewUser || false,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );

  try {
    await establishAuthSession(result.user);
  } catch (error) {
    await signOut(auth);
    throw error;
  }
  setAuthCookie(true, true);

  return result;
}

export async function logoutUser() {
  let response: Response;
  try {
    response = await fetch("/api/auth/session", { method: "DELETE" });
  } catch {
    throw new Error(
      "We couldn’t reach the server to end your secure session. You are still signed in; please try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      "We couldn’t confirm that your secure session ended. You are still signed in; please try again."
    );
  }

  try {
    await signOut(auth);
  } finally {
    clearAuthCookies();
  }
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/email-already-in-use":
        return "This email is already linked to an account.";

      case "auth/weak-password":
        return "Password should be at least 6 characters.";

      case "auth/missing-password":
        return "Please enter your password.";

      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";

      case "auth/operation-not-allowed":
        return "This sign-in method is not enabled in Firebase.";

      case "auth/unauthorized-domain":
        return "This domain is not authorized in Firebase Authentication settings.";

      case "auth/popup-blocked":
        return "The Google sign-in popup was blocked by your browser.";

      case "auth/popup-closed-by-user":
        return "Google sign-in was closed before completing.";

      case "auth/cancelled-popup-request":
        return "Another Google sign-in popup is already open.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      case "auth/too-many-requests":
        return "Too many attempts. Please wait a while and try again.";

      case "auth/user-disabled":
        return "This account is unavailable. Please contact support.";

      case "auth/expired-action-code":
        return "This reset link has expired. Please request a new one.";

      case "auth/invalid-action-code":
        return "This reset link is invalid or has already been used.";

      default:
        return "Authentication failed. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}
