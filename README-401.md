### 401 Handling, Auth Token Injection & HTTP-only Cookie Session

Protected API access and unauthorized handling are standardized.

Key components:

1. `lib/api.ts` (`fetchPostById`):

- Reads access token from HTTP-only cookie `ps_access_token` (or passed param).
- Adds `Authorization: Bearer <token>` header when available.
- Throws an error tagged with `status = 401` for unauthorized responses.

2. HTTP-only cookie management route: `app/api/auth/session/route.ts`:

- `POST /api/auth/session` with JSON `{ accessToken, expires }` sets cookie securely (httpOnly, sameSite=lax, secure in production).
- `DELETE /api/auth/session` clears the cookie.

3. `components/auth/AuthProvider.tsx`:

- After successful login/register, persists user/tokens to localStorage AND calls the session route to sync the HTTP-only cookie for server rendering.
- On logout, removes localStorage state and clears the cookie via DELETE.

4. `app/post/[id]/page.tsx`:

- Catches 401 from `fetchPostById` and renders `LoginRequired` instead of 404.

5. `components/auth/LoginRequired.tsx`:

- Displays a blocking UI prompting login/registration.

Why both localStorage + cookie?  
LocalStorage keeps immediate client state (no extra round trip on refresh); the HTTP-only cookie makes the token available in server components without exposing it to client JS, improving security and enabling SSR of protected content.

Adapting another server component that requires auth:

```tsx
import { fetchSomethingSecure } from "@/lib/api";
import { LoginRequired } from "@/components/auth/LoginRequired";

export default async function SecurePage() {
  try {
    const data = await fetchSomethingSecure();
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  } catch (e: any) {
    if (e?.status === 401) return <LoginRequired />;
    throw e; // or custom error UI
  }
}
```

Future enhancements:

- Refresh token handling (rotate access token before expiry and resync cookie).
- Central unified fetch wrapper for all endpoints.
- Server Actions to encapsulate mutations with auth automatically applied.
