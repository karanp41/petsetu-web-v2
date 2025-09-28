Static assets for the site header and favicon

Place the provided files into this folder with the exact names below so they are served from the site root:

- petsetu-logo.png (header logo)

  - Recommended: transparent PNG, height ~40px (e.g., 180x40 or similar)
  - Served at: /petsetu-logo.png

- favicon.png (site favicon)

  - Recommended: 32x32 PNG
  - Served at: /favicon.png

- favicon.ico (optional, legacy favicon)

  - Multi-size ICO (16, 32, 48)
  - Served at: /favicon.ico

- apple-touch-icon.png (optional, iOS home screen icon)
  - Recommended: 180x180 PNG
  - Served at: /apple-touch-icon.png

Notes

- Next.js serves files in /public at the site root; no code changes are needed once files are in place.
- The header component expects /petsetu-logo.png. The layout metadata references /favicon.png (and optionally /favicon.ico and /apple-touch-icon.png).
