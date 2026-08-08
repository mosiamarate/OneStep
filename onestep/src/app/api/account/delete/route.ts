import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../lib/firebase-admin";

export const runtime = "nodejs";

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim();
}

async function deleteQueryBatch(query: FirebaseFirestore.Query) {
  const snapshot = await query.limit(100).get();
  if (snapshot.empty) return;

  const batch = adminDb.batch();
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  await batch.commit();

  // Recursively delete if more remain
  if (snapshot.size >= 100) {
    await deleteQueryBatch(query);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication token." },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (authError) {
      console.error("Token verification error during account deletion:", authError);
      return NextResponse.json(
        { error: "Unauthorized: Invalid authentication token." },
        { status: 401 }
      );
    }

    const uid = decodedToken.uid;
    if (!uid) {
      return NextResponse.json(
        { error: "Forbidden: Invalid user session." },
        { status: 403 }
      );
    }

    // 1. Delete user-related Firestore data
    const userDocRef = adminDb.collection("users").doc(uid);

    const tasksQuery = adminDb.collection("tasks").where("userId", "==", uid);
    const moodsQuery = adminDb.collection("moods").where("userId", "==", uid);
    const focusSessionsQuery = adminDb.collection("focusSessions").where("userId", "==", uid);
    const emailOtpsQuery = adminDb.collection("emailOtps").where("uid", "==", uid);

    await Promise.all([
      userDocRef.delete().catch((err) => console.warn("Failed deleting user doc:", err)),
      deleteQueryBatch(tasksQuery),
      deleteQueryBatch(moodsQuery),
      deleteQueryBatch(focusSessionsQuery),
      deleteQueryBatch(emailOtpsQuery),
    ]);

    // Also check for emailOtps doc IDs formatted as `${purpose}_${uid}`
    const otpDocIds = [`email_verification_${uid}`, `password_reset_${uid}`];
    await Promise.all(
      otpDocIds.map((id) =>
        adminDb.collection("emailOtps").doc(id).delete().catch(() => {})
      )
    );

    // 2. Delete Firebase Authentication Account
    await adminAuth.deleteUser(uid);

    return NextResponse.json(
      { ok: true, message: "Account and associated data deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again later." },
      { status: 500 }
    );
  }
}
