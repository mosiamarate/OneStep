import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db, googleProvider } from "../lib/firebase";




export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
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

  await updateProfile(userCredential.user, {
    displayName: fullName,
  });

  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    fullName,
    email,
    photoURL: "",
    provider: "password",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

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
      photoURL: result.user.photoURL || "",
      provider: "google",
      isNewUser: extraInfo?.isNewUser || false,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );

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
      isNewUser: extraInfo?.isNewUser || false,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );

  return result;
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  return signOut(auth);
}

export function getAuthErrorMessage(error: unknown) {
  console.error("Firebase Auth Error:", error);

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

      default:
        return `Authentication error: ${error.code}`;
    }
  }

  return "Something went wrong. Please try again.";
}
