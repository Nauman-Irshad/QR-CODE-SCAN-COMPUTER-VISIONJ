# Smart Fitao — Phone photo (QR scan)

Simple phone camera for **2D try-on**. Photos stored in **Vercel Blob**.

**Live:** [qr-code-scan-computer-visionj.vercel.app](https://qr-code-scan-computer-visionj.vercel.app)

## Vercel Blob setup (required)

1. Open [Vercel Dashboard](https://vercel.com) → project **QR-CODE-SCAN-COMPUTER-VISIONJ**
2. **Storage** → **Blob** → **Create store** (if none)
3. Connect store to this project — Vercel adds **`BLOB_READ_WRITE_TOKEN`** automatically
4. **Redeploy** the project

Without Blob, phone upload returns: *"Vercel Blob not configured"*.

## How it works

1. Desktop `/2d-try-on` shows QR (session from `POST /api/phone-sync`)
2. Phone scans QR → opens this app → capture photo
3. Photo uploads to **Vercel Blob** (`phone-sync/{sessionId}.jpg`)
4. Desktop polls `GET /api/phone-sync?session=…` → gets `image_url` → try-on loads photo

## Main website env

```env
VITE_CV_PHONE_URL=https://qr-code-scan-computer-visionj.vercel.app
```

## API

| Route | Method | Description |
|--------|--------|-------------|
| `/` | GET | Phone camera UI |
| `/api/phone-sync` | POST | Create session `{ session_id }` |
| `/api/phone-sync?session=…&upload=1` | POST | Upload photo → Vercel Blob |
| `/api/phone-sync?session=…` | GET | Poll `{ ready, image_url }` |
| `/qr?to=URL` | GET | QR PNG |

## GitHub

https://github.com/Nauman-Irshad/QR-CODE-SCAN-COMPUTER-VISIONJ
