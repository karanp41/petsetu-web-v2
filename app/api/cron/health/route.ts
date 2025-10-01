// Scheduled cron route: calls `${API_BASE}/data/app-initial-metadata` hourly via Vercel crons
// NOTE: Ensure API_BASE is set in Vercel Project Environment Variables (Production/Preview/Development) and points to your API base (e.g., https://api.example.com/v1)

import { NextResponse } from "next/server";

// Use Node.js runtime so we can access secure env vars (process.env.API_BASE)
export const runtime = "nodejs";

// Avoid static optimization/caching for scheduled runs
export const dynamic = "force-dynamic";

function buildHealthUrl() {
  const base = process.env.API_BASE;
  if (!base) {
    throw new Error("Missing required env var: API_BASE");
  }
  // Robustly construct `${API_BASE}/data/app-initial-metadata`
  return new URL(
    "data/app-initial-metadata",
    base.endsWith("/") ? base : base + "/"
  );
}

export async function GET() {
  const startedAt = new Date().toISOString();

  let url: URL;
  try {
    url = buildHealthUrl();
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        startedAt,
        error: e?.message ?? "Failed to build health URL",
      },
      { status: 500 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

  try {
    const res = await fetch(url, {
      method: "GET",
      // Forward a simple UA and no-cache to ensure API is actually hit
      headers: {
        "User-Agent": "petsetu-cron/1.0",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    });
    const text = await res.text().catch(() => "");

    return NextResponse.json(
      {
        ok: res.ok,
        startedAt,
        completedAt: new Date().toISOString(),
        target: url.toString(),
        status: res.status,
        statusText: res.statusText,
        bodyPreview: text?.slice(0, 500) ?? null,
      },
      { status: res.ok ? 200 : 502 }
    );
  } catch (err: any) {
    const isAbort = err?.name === "AbortError";
    return NextResponse.json(
      {
        ok: false,
        startedAt,
        completedAt: new Date().toISOString(),
        target: url.toString(),
        error: isAbort ? "Request timed out" : err?.message ?? "Request failed",
      },
      { status: 504 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

// Optional: allow POST if Vercel uses POST for cron (GET is sufficient)
export const POST = GET;
