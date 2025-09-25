import { NextRequest, NextResponse } from "next/server";

// Cookie name consistent with server-side fetch reader.
const COOKIE_NAME = "ps_access_token";

// Helper: set cookie with secure attributes.
function setAuthCookie(token: string, expiresIso?: string) {
  const res = NextResponse.json({ ok: true });
  // Derive expiry; fallback 1h if parsing fails.
  let maxAge = 3600; // seconds
  if (expiresIso) {
    const exp = Date.parse(expiresIso);
    if (!isNaN(exp)) {
      const diffMs = exp - Date.now();
      if (diffMs > 0)
        maxAge = Math.min(Math.floor(diffMs / 1000), 60 * 60 * 24 * 7);
    }
  }
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token: string | undefined = body?.accessToken;
    const expires: string | undefined = body?.expires; // ISO timestamp
    if (!token) {
      return NextResponse.json(
        { error: "accessToken required" },
        { status: 400 }
      );
    }
    return setAuthCookie(token, expires);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to set session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
