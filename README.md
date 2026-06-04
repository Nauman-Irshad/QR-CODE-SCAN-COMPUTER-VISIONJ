# QR Code Scan — Computer Vision (Smart Fitao)

Browser body scan with **MediaPipe pose** (33+ landmarks), **phone QR**, and **2D try-on handoff**.

Deploy on [Vercel](https://vercel.com) — works on **user phone camera** over HTTPS.

## Features

- Live A-pose body scan in the browser (no server GPU required)
- QR code for phone (rear camera)
- After capture → **Go to 2D Try On** with your photo
- Upload API stores images on **Vercel Blob**

## Deploy to Vercel

1. Push this repo to GitHub: [QR-CODE-SCAN-COMPUTER-VISIONJ](https://github.com/Nauman-Irshad/QR-CODE-SCAN-COMPUTER-VISIONJ)
2. Import project in Vercel → connect GitHub repo
3. Add env var: **`BLOB_READ_WRITE_TOKEN`** (Vercel Storage → Blob → create token)
4. Deploy — you get e.g. `https://qr-code-scan-computer-visionj.vercel.app`

## Connect to main website

On the Smart Fitao website (5177 / Vercel), set:

```env
VITE_CV_CAMERA_URL=https://your-cv-app.vercel.app
```

QR on `/body-scan` will point phones to the deployed CV app. After capture, photo flows to `/2d-try-on`.

## URL params

| Param | Purpose |
|-------|---------|
| `embed=1` | Embedded / phone mode |
| `tryon_return` | 2D try-on base URL (handoff after capture) |
| `return` | Relative back path |
| `return_to` | Full back URL |
| `pid` | Product id |

## Local Flask (optional)

For dev with full OpenCV server fallback, use the sibling folder:

`Computer Vision (Camera Work)/` on port **5003** — proxied by website as `/cv-camera/`.

## API

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Body scan UI |
| `/analyze` | POST | multipart `image` + optional `pose_json` → Blob URL |
| `/qr` | GET | QR PNG for current deploy URL |

## GitHub

https://github.com/Nauman-Irshad/QR-CODE-SCAN-COMPUTER-VISIONJ
