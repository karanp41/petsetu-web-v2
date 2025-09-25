import "server-only";
// Auth server helpers (used in server components or route handlers)
// For client-side forms we'll call fetch directly; but we centralize types here.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  userType?: string[];
  phone?: string;
  city?: string;
  country?: string;
  sellerType?: string;
  pincode?: number;
  isMailVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  loc?: { type?: string; coordinates?: [number, number] };
  pets?: any[];
}

export interface TokenPair {
  access: { token: string; expires: string };
  refresh: { token: string; expires: string };
}

export interface AuthResponse {
  user: AuthUser;
  tokens: TokenPair;
}

const API_BASE = process.env.API_BASE;
if (!API_BASE) {
  throw new Error("Missing required environment variable API_BASE for auth");
}

export async function serverFetchRegister(
  payload: Record<string, any>
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Register failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export async function serverFetchLogin(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
