# Smart Fitao — Phone photo (GitHub Pages)

Simple phone camera for **2D try-on**. Hosted on **GitHub Pages** (no Vercel).

**Live:** https://nauman-irshad.github.io/QR-CODE-SCAN-COMPUTER-VISIONJ/

## How it works

1. Desktop `/2d-try-on` shows QR with a session id
2. Phone scans QR → opens this GitHub Pages app
3. User captures photo → saved to **Firebase Firestore** (`phone_tryon_sync`)
4. Desktop polls Firestore → photo loads in try-on

## Enable GitHub Pages (one time)

1. GitHub repo → **Settings** → **Pages**
2. **Source:** GitHub Actions (workflow deploys on push to `main`)

Or: **Deploy from branch** → `main` → `/ (root)` → Save

## Firestore rules (required)

Firebase Console → Firestore → **Rules**:

```
match /phone_tryon_sync/{sessionId} {
  allow read, write: if true;
}
```

Publish rules.

## Main website env

```
VITE_CV_PHONE_URL=https://nauman-irshad.github.io/QR-CODE-SCAN-COMPUTER-VISIONJ
```

## URL params

| Param | Purpose |
|--------|---------|
| `phone_session` | Session id from desktop QR |

Example:

```
https://nauman-irshad.github.io/QR-CODE-SCAN-COMPUTER-VISIONJ/?phone_session=abc123
```

## GitHub

https://github.com/Nauman-Irshad/QR-CODE-SCAN-COMPUTER-VISIONJ
