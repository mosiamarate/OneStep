import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../lib/firebase-admin";

export const runtime = "nodejs";

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim();
}

function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      result[key] = serializeValue((value as Record<string, unknown>)[key]);
    }
    return result;
  }

  return value;
}

export async function GET(request: NextRequest) {
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
      console.error("Token verification error during export:", authError);
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

    // 1. Fetch user auth & profile details
    const authUser = await adminAuth.getUser(uid).catch(() => null);
    const userDocSnap = await adminDb.collection("users").doc(uid).get();
    const userDocData = userDocSnap.exists ? userDocSnap.data() || {} : {};

    const userProfile = {
      uid,
      displayName:
        userDocData.displayName ||
        userDocData.fullName ||
        authUser?.displayName ||
        "",
      email: authUser?.email || userDocData.email || "",
      photoURL: authUser?.photoURL || userDocData.photoURL || "",
      provider: userDocData.provider || authUser?.providerData?.[0]?.providerId || "unknown",
      createdAt: serializeValue(
        userDocData.createdAt || authUser?.metadata.creationTime || null
      ),
      updatedAt: serializeValue(userDocData.updatedAt || null),
    };

    // 2. Fetch user collections
    const [tasksSnap, moodsSnap, focusSessionsSnap] = await Promise.all([
      adminDb.collection("tasks").where("userId", "==", uid).get(),
      adminDb.collection("moods").where("userId", "==", uid).get(),
      adminDb.collection("focusSessions").where("userId", "==", uid).get(),
    ]);

    const tasks = tasksSnap.docs.map((doc) => ({
      id: doc.id,
      ...(serializeValue(doc.data() as Record<string, unknown>) as Record<string, unknown>),
    }));

    const moods = moodsSnap.docs.map((doc) => ({
      id: doc.id,
      ...(serializeValue(doc.data() as Record<string, unknown>) as Record<string, unknown>),
    }));

    const focusSessions = focusSessionsSnap.docs.map((doc) => ({
      id: doc.id,
      ...(serializeValue(doc.data() as Record<string, unknown>) as Record<string, unknown>),
    }));

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user: userProfile,
      tasks,
      moods,
      focusSessions,
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="onestep-data-export-${uid}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export user data. Please try again later." },
      { status: 500 }
    );
  }
}
