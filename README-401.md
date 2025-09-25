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

---

### HeroBannerCarousel (Homepage Postcard Slider)

The homepage hero now uses `HeroBannerCarousel` (`components/layout/HeroBannerCarousel.tsx`) instead of a static image. It presents the images found in `assets/home_banner` in a looping, autoplaying postcard-style slider.

Key characteristics:

- Autoplay with pause on hover (Embla + autoplay plugin)
- Manual navigation with previous/next circular buttons
- Animated progress bar style dots (current slide shows animated fill over the autoplay interval)
- Layered "postcard stack" visual (two subtle rotated translucent layers behind the active slide)
- Perspective transform easing into flat on hover
- Gradient overlay for consistent text contrast if future captions are added

Basic usage (already wired in `app/page.tsx`):

```tsx
import HeroBannerCarousel from "@/components/layout/HeroBannerCarousel";

export function Example() {
  return (
    <div className="max-w-xl mx-auto">
      <HeroBannerCarousel autoPlayDelay={3500} />
    </div>
  );
}
```

To add/remove images: place or remove `.jpg/.png` files under `assets/home_banner` and update the static imports at the top of `HeroBannerCarousel.tsx`. (Static imports allow Next.js to optimize and optionally generate blur placeholders.)

Possible future enhancements:

- Add caption metadata (array of objects with `image`, `title`, `cta`)
- Integrate lazy loading for non-initial images with `loading="lazy"`
- Add swipe progress indicator / fraction display (e.g., 1 / 7)
- Convert aspect handling to accept explicit width/height ratio props
