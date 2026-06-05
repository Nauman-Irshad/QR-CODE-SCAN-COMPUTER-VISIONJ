# Smart Fitao — Phone photo (QR scan)

Simple **phone camera** app for **2D try-on**. No pose detection, no MediaPipe, no computer vision.

Deploy on Vercel — phones open over **HTTPS** and send photos to the main Smart Fitao website.

**Live:** [qr-code-scan-computer-visionj.vercel.app](https://qr-code-scan-computer-visionj.vercel.app)

## How it works

1. User opens **2D Try-On** on the main website (`/2d-try-on`)
2. Desktop shows a **QR code**
3. User scans QR on phone → opens **this Vercel app**
4. User takes a photo (shalwar kameez) → **auto-uploads** to the website
5. Photo appears on desktop try-on → pick kurta → run try-on

## URL params (from website QR)

| Param | Purpose |
|--------|---------|
| `phone_session` | Sync session id (created on main website) |
| `website` | Main site origin, e.g. `https://fyp-web-code-deployment.vercel.app` |

Example:

```
https://qr-code-scan-computer-visionj.vercel.app/?phone_session=abc123&website=https://fyp-web-code-deployment.vercel.app
```

## Firestore (phone → desktop photo)

Phone saves the photo to Firestore collection **`phone_tryon_sync`** (document id = session id from QR).

In Firebase Console → Firestore → Rules, allow (demo / FYP):

```
match /phone_tryon_sync/{sessionId} {
  allow read, write: if true;
}
```

Desktop `/2d-try-on` polls this collection every 2.5s.

## Deploy to Vercel

1. Push to [QR-CODE-SCAN-COMPUTER-VISIONJ](https://github.com/Nauman-Irshad/QR-CODE-SCAN-COMPUTER-VISIONJ)
2. Import in Vercel → connect GitHub
3. Optional: `BLOB_READ_WRITE_TOKEN` (only if using `/analyze` upload route)
4. Main website needs `BLOB_READ_WRITE_TOKEN` for `/api/phone-photo-session`

## Main website env

```env
VITE_CV_PHONE_URL=https://qr-code-scan-computer-visionj.vercel.app
```

## API

| Route | Method | Description |
|--------|--------|-------------|
| `/` | GET | Phone camera UI |
| `/qr?to=URL` | GET | QR PNG for a URL |
| `/analyze` | POST | Simple image upload → Blob URL (legacy proxy) |

## GitHub

https://github.com/Nauman-Irshad/QR-CODE-SCAN-COMPUTER-VISIONJ
